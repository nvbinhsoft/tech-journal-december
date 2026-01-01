import jwt from 'jsonwebtoken';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';

export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}

/**
 * Extract and verify JWT token from Authorization header.
 * Returns the decoded payload or null if invalid.
 */
export function verifyToken(event: APIGatewayProxyEventV2): JwtPayload | null {
    const authHeader = event.headers.authorization || event.headers.Authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        console.error('JWT_SECRET not configured');
        return null;
    }

    try {
        const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
        return decoded;
    } catch (error) {
        console.error('JWT verification failed:', error);
        return null;
    }
}

/**
 * Generate a new JWT token for a user.
 */
export function generateToken(userId: string, email: string, role: string): string {
    const jwtSecret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || '86400';

    if (!jwtSecret) {
        throw new Error('JWT_SECRET not configured');
    }

    return jwt.sign(
        { sub: userId, email, role },
        jwtSecret,
        { expiresIn: parseInt(expiresIn, 10) }
    );
}

/**
 * Middleware helper to require authentication.
 * Returns the user payload or throws an error response.
 */
export function requireAuth(event: APIGatewayProxyEventV2): JwtPayload {
    const user = verifyToken(event);
    if (!user) {
        throw { statusCode: 401, message: 'Unauthorized' };
    }
    return user;
}
