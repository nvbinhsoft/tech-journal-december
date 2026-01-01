import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { connectToDatabase } from '../../../lib/database.js';
import { verifyToken } from '../../../lib/auth.js';
import { success, error, unauthorized, parseBody, serverError } from '../../../lib/response.js';
import { Article } from '../../../models/Article.js';
import '../../../models/Tag.js'; // Register Tag schema for populate

interface CreateArticleRequest {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string | null;
    tags?: string[];
    published?: boolean;
}

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
        // Verify JWT
        const user = verifyToken(event);
        if (!user) {
            return unauthorized();
        }

        await connectToDatabase();

        const body = parseBody<CreateArticleRequest>(event.body);
        if (!body) {
            return error('Invalid request body');
        }

        // Validate required fields
        if (!body.title || !body.slug || !body.excerpt || !body.content) {
            return error('Title, slug, excerpt, and content are required');
        }

        // Check if slug already exists
        const existingArticle = await Article.findOne({ slug: body.slug });
        if (existingArticle) {
            return error('An article with this slug already exists');
        }

        // Create article
        const article = new Article({
            title: body.title,
            slug: body.slug.toLowerCase(),
            excerpt: body.excerpt,
            content: body.content,
            coverImage: body.coverImage || null,
            tags: body.tags || [],
            published: body.published || false,
        });

        await article.save();

        // Populate tags for response
        await article.populate('tags', 'name slug color');

        const articleObj = article.toJSON();
        return success({
            ...articleObj,
            id: article._id.toString(),
            tags: (article.tags as unknown[])?.map((tag: unknown) => {
                const t = tag as Record<string, unknown>;
                return {
                    ...t,
                    id: (t._id as { toString(): string })?.toString(),
                    _id: undefined,
                };
            }),
        }, 201);
    } catch (err) {
        return serverError(err);
    }
};
