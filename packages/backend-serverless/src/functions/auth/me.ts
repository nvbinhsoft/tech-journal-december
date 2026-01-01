import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { connectToDatabase } from '../../lib/database.js';
import { verifyToken } from '../../lib/auth.js';
import { success, unauthorized, notFound, serverError } from '../../lib/response.js';
import { User } from '../../models/User.js';

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
        // Verify JWT token
        const payload = verifyToken(event);
        if (!payload) {
            return unauthorized();
        }

        await connectToDatabase();

        // Get current user
        const user = await User.findById(payload.sub).lean();
        if (!user) {
            return notFound('User');
        }

        return success({
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
        });
    } catch (err) {
        return serverError(err);
    }
};
