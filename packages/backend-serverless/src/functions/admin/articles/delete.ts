import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { connectToDatabase } from '../../../lib/database.js';
import { verifyToken } from '../../../lib/auth.js';
import { successMessage, notFound, unauthorized, serverError } from '../../../lib/response.js';
import { Article } from '../../../models/Article.js';

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

        // Find and delete article
        const article = await Article.findByIdAndDelete(id);
        if (!article) {
            return notFound('Article');
        }

        return successMessage('Article deleted successfully');
    } catch (err) {
        return serverError(err);
    }
};
