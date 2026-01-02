// Tags API endpoints

import { api } from './client';
import type {
    ApiResponse,
    ApiListResponse,
    Tag,
    CreateTagRequest,
    UpdateTagRequest,
} from './types';

export const tagsApi = {
    // ============================================
    // Public endpoints
    // ============================================

    /**
     * Get all tags (public)
     */
    async getPublicTags(): Promise<Tag[]> {
        const response = await api.get<ApiListResponse<Tag>>('/api/public/tags');
        return response.data;
    },

    // ============================================
    // Admin endpoints (requires auth)
    // ============================================

    /**
     * Get all tags with article count (admin)
     */
    async getAdminTags(): Promise<Tag[]> {
        const response = await api.get<ApiListResponse<Tag>>('/api/admin/tags', true);
        return response.data;
    },

    /**
     * Create a new tag
     */
    async createTag(data: CreateTagRequest): Promise<Tag> {
        const response = await api.post<ApiResponse<Tag>>('/api/admin/tags', data, true);
        return response.data;
    },

    /**
     * Update an existing tag
     */
    async updateTag(id: string, data: UpdateTagRequest): Promise<Tag> {
        const response = await api.put<ApiResponse<Tag>>(`/api/admin/tags/${id}`, data, true);
        return response.data;
    },

    /**
     * Delete a tag
     */
    async deleteTag(id: string): Promise<void> {
        await api.delete<ApiResponse<{ message: string }>>(`/api/admin/tags/${id}`, true);
    },
};
