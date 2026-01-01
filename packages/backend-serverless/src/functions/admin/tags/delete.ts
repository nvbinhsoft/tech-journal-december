import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { connectToDatabase } from '../../../lib/database.js';
import { verifyToken } from '../../../lib/auth.js';
import { successMessage, notFound, unauthorized, serverError } from '../../../lib/response.js';
import { Tag } from '../../../models/Tag.js';
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
            return notFound('Tag');
        }

        // Find and delete tag
        const tag = await Tag.findByIdAndDelete(id);
        if (!tag) {
            return notFound('Tag');
        }

        // Remove tag from all articles
        await Article.updateMany(
            { tags: id },
            { $pull: { tags: id } }
        );

        return successMessage('Tag deleted successfully');
    } catch (err) {
        return serverError(err);
    }
};
