// Settings API endpoints

import { api } from './client';
import type { ApiResponse, Settings, UpdateSettingsRequest } from './types';

export const settingsApi = {
    // ============================================
    // Public endpoints
    // ============================================

    /**
     * Get blog settings (public)
     */
    async getPublicSettings(): Promise<Settings> {
        const response = await api.get<ApiResponse<Settings>>('/public/settings');
        return response.data;
    },

    // ============================================
    // Admin endpoints (requires auth)
    // ============================================

    /**
     * Get blog settings (admin)
     */
    async getAdminSettings(): Promise<Settings> {
        const response = await api.get<ApiResponse<Settings>>('/admin/settings', true);
        return response.data;
    },

    /**
     * Update blog settings
     */
    async updateSettings(data: UpdateSettingsRequest): Promise<Settings> {
        const response = await api.put<ApiResponse<Settings>>('/admin/settings', data, true);
        return response.data;
    },
};
