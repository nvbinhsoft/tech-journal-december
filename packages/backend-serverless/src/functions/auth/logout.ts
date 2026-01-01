import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { verifyToken } from '../../lib/auth.js';
import { successMessage, unauthorized } from '../../lib/response.js';

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    // Verify token (optional - just for consistency)
    const user = verifyToken(event);
    if (!user) {
        return unauthorized();
    }

    // JWT is stateless, so we just return success
    // Client should remove the token from storage
    return successMessage('Logged out successfully');
};
