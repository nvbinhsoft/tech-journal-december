import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { connectToDatabase } from '../../lib/database.js';
import { success, notFound, serverError } from '../../lib/response.js';
import { Article } from '../../models/Article.js';
import '../../models/Tag.js'; // Register Tag schema for populate

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
        await connectToDatabase();

        const slug = event.pathParameters?.slug;
        if (!slug) {
            return notFound('Article');
        }

        const article = await Article.findOne({ slug, published: true })
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
