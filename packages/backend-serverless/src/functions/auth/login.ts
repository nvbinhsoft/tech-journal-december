import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '../../lib/database.js';
import { generateToken } from '../../lib/auth.js';
import { success, error, parseBody, serverError } from '../../lib/response.js';
import { User } from '../../models/User.js';

interface LoginRequest {
    email: string;
    password: string;
}

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
        await connectToDatabase();

        const body = parseBody<LoginRequest>(event.body);
        if (!body || !body.email || !body.password) {
            return error('Email and password are required');
        }

        // Find user by email
        const user = await User.findOne({ email: body.email.toLowerCase() });
        if (!user) {
            return error('Invalid email or password', 401);
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(body.password, user.passwordHash);
        if (!isValidPassword) {
            return error('Invalid email or password', 401);
        }

        // Generate JWT token
        const token = generateToken(
            user._id.toString(),
            user.email,
            user.role
        );

        return success({
            token,
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    } catch (err) {
        return serverError(err);
    }
};
