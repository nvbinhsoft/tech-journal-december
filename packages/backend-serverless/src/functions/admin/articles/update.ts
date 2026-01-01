import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { connectToDatabase } from '../../../lib/database.js';
import { verifyToken } from '../../../lib/auth.js';
import { success, error, notFound, unauthorized, parseBody, serverError } from '../../../lib/response.js';
import { Article } from '../../../models/Article.js';
import '../../../models/Tag.js'; // Register Tag schema for populate

interface UpdateArticleRequest {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
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

        const id = event.pathParameters?.id;
        if (!id) {
            return notFound('Article');
        }

        const body = parseBody<UpdateArticleRequest>(event.body);
        if (!body) {
            return error('Invalid request body');
        }

        // Find article
        const article = await Article.findById(id);
        if (!article) {
            return notFound('Article');
        }

        // Check slug uniqueness if changing
        if (body.slug && body.slug !== article.slug) {
            const existingArticle = await Article.findOne({ slug: body.slug });
            if (existingArticle) {
                return error('An article with this slug already exists');
            }
        }

        // Update fields
        if (body.title !== undefined) article.title = body.title;
        if (body.slug !== undefined) article.slug = body.slug.toLowerCase();
        if (body.excerpt !== undefined) article.excerpt = body.excerpt;
        if (body.content !== undefined) article.content = body.content;
        if (body.coverImage !== undefined) article.coverImage = body.coverImage;
        if (body.tags !== undefined) article.tags = body.tags as unknown as typeof article.tags;
        if (body.published !== undefined) article.published = body.published;

        await article.save();

        const articleObj = article.toJSON();
        return success({
            ...articleObj,
            id: article._id.toString(),
        });
    } catch (err) {
        return serverError(err);
    }
};
