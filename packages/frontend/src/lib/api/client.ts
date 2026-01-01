// HTTP Client for API calls

import type { ErrorResponse } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Token storage
let accessToken: string | null = null;

// Session expired callback - will be set by the store
let onSessionExpired: (() => void) | null = null;

export function setSessionExpiredCallback(callback: () => void) {
    onSessionExpired = callback;
}

export function setAccessToken(token: string | null) {
    accessToken = token;
    if (token) {
        localStorage.setItem('accessToken', token);
    } else {
        localStorage.removeItem('accessToken');
    }
}

export function getAccessToken(): string | null {
    if (!accessToken) {
        accessToken = localStorage.getItem('accessToken');
    }
    return accessToken;
}

export function clearAccessToken() {
    accessToken = null;
    localStorage.removeItem('accessToken');
}

// Custom error class for API errors
export class ApiError extends Error {
    code: string;
    status: number;
    details?: Array<{ field: string; message: string }>;

    constructor(message: string, code: string, status: number, details?: Array<{ field: string; message: string }>) {
        super(message);
        this.name = 'ApiError';
        this.code = code;
        this.status = status;
        this.details = details;
    }
}

// Request options type
interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: unknown;
    headers?: Record<string, string>;
    requiresAuth?: boolean;
}

// Main fetch wrapper
export async function apiRequest<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    const { method = 'GET', body, headers = {}, requiresAuth = false } = options;

    const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers,
    };

    // Add auth token if required
    if (requiresAuth) {
        const token = getAccessToken();
        if (token) {
            requestHeaders['Authorization'] = `Bearer ${token}`;
        }
    }

    const config: RequestInit = {
        method,
        headers: requestHeaders,
    };

    if (body && method !== 'GET') {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        // Handle 401 Unauthorized - session expired
        if (response.status === 401 && requiresAuth) {
            clearAccessToken();
            if (onSessionExpired) {
                onSessionExpired();
            }
            throw new ApiError(
                'Session expired. Please log in again.',
                'SESSION_EXPIRED',
                401
            );
        }

        // Handle non-JSON responses
        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
            if (!response.ok) {
                throw new ApiError(
                    'Server error',
                    'SERVER_ERROR',
                    response.status
                );
            }
            return {} as T;
        }

        const data = await response.json();

        if (!response.ok) {
            const errorData = data as ErrorResponse;
            throw new ApiError(
                errorData.error?.message || 'Request failed',
                errorData.error?.code || 'UNKNOWN_ERROR',
                response.status,
                errorData.error?.details
            );
        }

        return data as T;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        // Network error or other fetch error
        throw new ApiError(
            error instanceof Error ? error.message : 'Network error',
            'NETWORK_ERROR',
            0
        );
    }
}

// Convenience methods
export const api = {
    get: <T>(endpoint: string, requiresAuth = false) =>
        apiRequest<T>(endpoint, { method: 'GET', requiresAuth }),

    post: <T>(endpoint: string, body?: unknown, requiresAuth = false) =>
        apiRequest<T>(endpoint, { method: 'POST', body, requiresAuth }),

    put: <T>(endpoint: string, body?: unknown, requiresAuth = false) =>
        apiRequest<T>(endpoint, { method: 'PUT', body, requiresAuth }),

    delete: <T>(endpoint: string, requiresAuth = false) =>
        apiRequest<T>(endpoint, { method: 'DELETE', requiresAuth }),
};

