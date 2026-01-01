import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { connectToDatabase } from '../../../lib/database.js';
import { verifyToken } from '../../../lib/auth.js';
import { successWithPagination, unauthorized, serverError } from '../../../lib/response.js';
import { Article } from '../../../models/Article.js';
import '../../../models/Tag.js'; // Register Tag schema for populate

interface QueryParams {
    page?: string;
    limit?: string;
    tag?: string;
    search?: string;
    published?: string;
}

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
        // Verify JWT
        const user = verifyToken(event);
        if (!user) {
            return unauthorized();
        }

        await connectToDatabase();

        const params = (event.queryStringParameters || {}) as QueryParams;
        const page = Math.max(1, parseInt(params.page || '1', 10));
        const limit = Math.min(50, Math.max(1, parseInt(params.limit || '10', 10)));
        const skip = (page - 1) * limit;

        // Build query - admin sees all articles (including drafts)
        const query: Record<string, unknown> = {};

        // Filter by published status
        if (params.published !== undefined) {
            query.published = params.published === 'true';
        }

        // Filter by tag
        if (params.tag) {
            query.tags = params.tag;
        }

        // Text search
        if (params.search) {
            query.$text = { $search: params.search };
        }

        // Execute query
        const [articles, total] = await Promise.all([
            Article.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('tags', 'name slug color')
                .lean(),
            Article.countDocuments(query),
        ]);

        // Transform articles
        const transformedArticles = articles.map((article) => ({
            ...article,
            id: article._id.toString(),
            _id: undefined,
            tags: article.tags?.map((tag: Record<string, unknown>) => ({
                ...tag,
                id: (tag._id as { toString(): string }).toString(),
                _id: undefined,
            })),
        }));

        const totalPages = Math.ceil(total / limit);

        return successWithPagination(transformedArticles, {
            page,
            limit,
            total,
            totalPages,
        });
    } catch (err) {
        return serverError(err);
    }
};
