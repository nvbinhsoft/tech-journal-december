import type { APIGatewayProxyResultV2 } from 'aws-lambda';

const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

/**
 * Standard success response with data
 */
export function success<T>(data: T, statusCode = 200): APIGatewayProxyResultV2 {
    return {
        statusCode,
        headers: corsHeaders,
        body: JSON.stringify({
            success: true,
            data,
        }),
    };
}

/**
 * Success response with pagination
 */
export function successWithPagination<T>(
    data: T[],
    pagination: { page: number; limit: number; total: number; totalPages: number }
): APIGatewayProxyResultV2 {
    return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
            success: true,
            data,
            pagination,
        }),
    };
}

/**
 * Success response with custom message
 */
export function successMessage(message: string): APIGatewayProxyResultV2 {
    return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
            success: true,
            message,
        }),
    };
}

/**
 * Error response
 */
export function error(message: string, statusCode = 400): APIGatewayProxyResultV2 {
    return {
        statusCode,
        headers: corsHeaders,
        body: JSON.stringify({
            success: false,
            error: message,
        }),
    };
}

/**
 * Not found response
 */
export function notFound(resource = 'Resource'): APIGatewayProxyResultV2 {
    return error(`${resource} not found`, 404);
}

/**
 * Unauthorized response
 */
export function unauthorized(message = 'Unauthorized'): APIGatewayProxyResultV2 {
    return error(message, 401);
}

/**
 * Internal server error
 */
export function serverError(err?: unknown): APIGatewayProxyResultV2 {
    console.error('Server error:', err);
    return error('Internal server error', 500);
}

/**
 * Parse JSON body from event, returns null if invalid
 */
export function parseBody<T>(body: string | undefined): T | null {
    if (!body) return null;
    try {
        return JSON.parse(body) as T;
    } catch {
        return null;
    }
}
