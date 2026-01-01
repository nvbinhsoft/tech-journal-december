import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { connectToDatabase } from '../../../lib/database.js';
import { verifyToken } from '../../../lib/auth.js';
import { success, error, unauthorized, parseBody, serverError } from '../../../lib/response.js';
import { Tag } from '../../../models/Tag.js';

interface CreateTagRequest {
    name: string;
    slug: string;
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

        const body = parseBody<CreateTagRequest>(event.body);
        if (!body) {
            return error('Invalid request body');
        }

        // Validate required fields
        if (!body.name || !body.slug) {
            return error('Name and slug are required');
        }

        // Check if tag with same name or slug exists
        const existingTag = await Tag.findOne({
            $or: [{ name: body.name }, { slug: body.slug }],
        });
        if (existingTag) {
            return error('A tag with this name or slug already exists');
        }

        // Create tag
        const tag = new Tag({
            name: body.name,
            slug: body.slug.toLowerCase(),
            color: body.color || '#3B82F6',
        });

        await tag.save();

        return success({
            ...tag.toJSON(),
            id: tag._id.toString(),
            articleCount: 0,
        }, 201);
    } catch (err) {
        return serverError(err);
    }
};
