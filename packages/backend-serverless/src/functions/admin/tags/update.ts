import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { connectToDatabase } from '../../../lib/database.js';
import { verifyToken } from '../../../lib/auth.js';
import { success, error, notFound, unauthorized, parseBody, serverError } from '../../../lib/response.js';
import { Tag } from '../../../models/Tag.js';

interface UpdateTagRequest {
    name?: string;
    slug?: string;
    color?: string;
}

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
        // Verify JWT
        const user = verifyToken(event);
        if (!user) {
            return unauthorized();
        }

        await connectToDatabase();

        const id = event.pathParameters?.id;
        if (!id) {
            return notFound('Tag');
        }

        const body = parseBody<UpdateTagRequest>(event.body);
        if (!body) {
            return error('Invalid request body');
        }

        // Find tag
        const tag = await Tag.findById(id);
        if (!tag) {
            return notFound('Tag');
        }

        // Check uniqueness if changing name or slug
        if (body.name || body.slug) {
            const conditions: Record<string, unknown>[] = [];
            if (body.name && body.name !== tag.name) {
                conditions.push({ name: body.name });
            }
            if (body.slug && body.slug !== tag.slug) {
                conditions.push({ slug: body.slug });
            }

            if (conditions.length > 0) {
                const existingTag = await Tag.findOne({
                    _id: { $ne: id },
                    $or: conditions,
                });
                if (existingTag) {
                    return error('A tag with this name or slug already exists');
                }
            }
        }

        // Update fields
        if (body.name !== undefined) tag.name = body.name;
        if (body.slug !== undefined) tag.slug = body.slug.toLowerCase();
        if (body.color !== undefined) tag.color = body.color;

        await tag.save();

        return success({
            ...tag.toJSON(),
            id: tag._id.toString(),
        });
    } catch (err) {
        return serverError(err);
    }
};
