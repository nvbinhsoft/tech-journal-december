import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { connectToDatabase } from '../../../lib/database.js';
import { verifyToken } from '../../../lib/auth.js';
import { success, notFound, unauthorized, serverError } from '../../../lib/response.js';
import { Article } from '../../../models/Article.js';
import '../../../models/Tag.js'; // Register Tag schema for populate

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
            return notFound('Article');
        }

        const article = await Article.findById(id)
            .populate('tags', 'name slug color')
            .lean();

        if (!article) {
            return notFound('Article');
        }

        // Transform article
        const transformedArticle = {
            ...article,
            id: article._id.toString(),
            _id: undefined,
            tags: article.tags?.map((tag: Record<string, unknown>) => ({
                ...tag,
                id: (tag._id as { toString(): string }).toString(),
                _id: undefined,
            })),
        };

        return success(transformedArticle);
    } catch (err) {
        return serverError(err);
    }
};
