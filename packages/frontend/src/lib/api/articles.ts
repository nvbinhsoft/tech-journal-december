// Articles API endpoints

import { api } from './client';
import type {
    ApiResponse,
    ApiListResponse,
    ArticleWithTags,
    CreateArticleRequest,
    UpdateArticleRequest,
    ArticleListParams,
} from './types';

function buildQueryString(params: ArticleListParams): string {
    const searchParams = new URLSearchParams();

    if (params.search) searchParams.set('search', params.search);
    if (params.tags) searchParams.set('tags', params.tags);
    if (params.published !== undefined) searchParams.set('published', String(params.published));
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);

    const query = searchParams.toString();
    return query ? `?${query}` : '';
}

export const articlesApi = {
    // ============================================
    // Public endpoints
    // ============================================

    /**
     * Get all published articles (public)
     */
    async getPublicArticles(params: ArticleListParams = {}): Promise<ApiListResponse<ArticleWithTags>> {
        const query = buildQueryString(params);
        return api.get<ApiListResponse<ArticleWithTags>>(`/public/articles${query}`);
    },

    /**
     * Get a single published article by slug (public)
     */
    async getPublicArticleBySlug(slug: string): Promise<ArticleWithTags> {
        const response = await api.get<ApiResponse<ArticleWithTags>>(`/public/articles/${slug}`);
        return response.data;
    },

    // ============================================
    // Admin endpoints (requires auth)
    // ============================================

    /**
     * Get all articles including drafts (admin)
     */
    async getAdminArticles(params: ArticleListParams = {}): Promise<ApiListResponse<ArticleWithTags>> {
        const query = buildQueryString(params);
        return api.get<ApiListResponse<ArticleWithTags>>(`/admin/articles${query}`, true);
    },

    /**
     * Get a single article by ID (admin)
     */
    async getAdminArticleById(id: string): Promise<ArticleWithTags> {
        const response = await api.get<ApiResponse<ArticleWithTags>>(`/admin/articles/${id}`, true);
        return response.data;
    },

    /**
     * Create a new article
     */
    async createArticle(data: CreateArticleRequest): Promise<ArticleWithTags> {
        const response = await api.post<ApiResponse<ArticleWithTags>>('/admin/articles', data, true);
        return response.data;
    },

    /**
     * Update an existing article
     */
    async updateArticle(id: string, data: UpdateArticleRequest): Promise<ArticleWithTags> {
        const response = await api.put<ApiResponse<ArticleWithTags>>(`/admin/articles/${id}`, data, true);
        return response.data;
    },

    /**
     * Delete an article
     */
    async deleteArticle(id: string): Promise<void> {
        await api.delete<ApiResponse<{ message: string }>>(`/admin/articles/${id}`, true);
    },
};
