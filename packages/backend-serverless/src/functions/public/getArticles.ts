import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { connectToDatabase } from '../../lib/database.js';
import { successWithPagination, serverError } from '../../lib/response.js';
import { Article } from '../../models/Article.js';
import '../../models/Tag.js'; // Import to register Tag schema for populate

interface QueryParams {
    page?: string;
    limit?: string;
    tag?: string;
    tags?: string;
    search?: string;
}

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
        await connectToDatabase();

        const params = (event.queryStringParameters || {}) as QueryParams;
        const page = Math.max(1, parseInt(params.page || '1', 10));
        const limit = Math.min(50, Math.max(1, parseInt(params.limit || '10', 10)));
        const skip = (page - 1) * limit;

        // Build query - only published articles for public
        const query: Record<string, unknown> = { published: true };

        // Filter by tag
        if (params.tag || params.tags) {
            query.tags = params.tag || params.tags;
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
                .lean(),
            Article.countDocuments(query),
        ]);

        // Transform articles
        const transformedArticles = articles.map((article) => ({
            ...article,
            id: article._id.toString(),
            _id: undefined,
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
