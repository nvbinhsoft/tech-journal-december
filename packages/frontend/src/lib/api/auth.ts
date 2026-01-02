// Auth API endpoints

import { api, setAccessToken, clearAccessToken } from './client';
import type { ApiResponse, LoginRequest, LoginResponseData, User } from './types';

export const authApi = {
    /**
     * Login with email and password
     */
    async login(credentials: LoginRequest): Promise<LoginResponseData> {
        const response = await api.post<ApiResponse<LoginResponseData>>(
            '/api/auth/login',
            credentials
        );

        // Store the access token
        if (response.data.token) {
            setAccessToken(response.data.token);
        }

        return response.data;
    },

    /**
     * Logout current user
     */
    async logout(): Promise<void> {
        try {
            await api.post<ApiResponse<{ message: string }>>('/api/auth/logout', undefined, true);
        } finally {
            // Always clear token, even if API call fails
            clearAccessToken();
        }
    },

    /**
     * Get current authenticated user
     */
    async getCurrentUser(): Promise<User> {
        const response = await api.get<ApiResponse<User>>('/api/auth/me', true);
        return response.data;
    },
};
