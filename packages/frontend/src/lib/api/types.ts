// API Response Types matching the swagger specification

// ============================================
// Common Types
// ============================================

export interface ApiResponse<T> {
    success: boolean;
    data: T;
}

export interface ApiListResponse<T> {
    success: boolean;
    data: T[];
    pagination?: Pagination;
}

export interface ErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
        details?: Array<{
            field: string;
            message: string;
        }>;
    };
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// ============================================
// Auth Types
// ============================================

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponseData {
    accessToken: string;
    expiresIn: number;
    user: User;
}

export interface User {
    id: string;
    email: string;
    role: 'admin';
    createdAt: string;
}

// ============================================
// Article Types
// ============================================

export interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string | null;
    tags: string[];
    published: boolean;
    readingTime?: number;
    createdAt: string;
    updatedAt: string;
}

export interface ArticleWithTags extends Article {
    tagDetails?: Tag[];
}

export interface CreateArticleRequest {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string | null;
    tags: string[];
    published?: boolean;
}

export interface UpdateArticleRequest {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    coverImage?: string | null;
    tags?: string[];
    published?: boolean;
}

export interface ArticleListParams {
    search?: string;
    tags?: string;
    published?: boolean;
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'updatedAt' | 'title';
    sortOrder?: 'asc' | 'desc';
}

// ============================================
// Tag Types
// ============================================

export interface Tag {
    id: string;
    name: string;
    slug: string;
    color: string;
    articleCount?: number;
}

export interface CreateTagRequest {
    name: string;
    slug: string;
    color: string;
}

export interface UpdateTagRequest {
    name?: string;
    slug?: string;
    color?: string;
}

// ============================================
// Settings Types
// ============================================

export interface Settings {
    blogTitle: string;
    blogDescription: string;
    authorName: string;
    authorBio?: string;
    authorAvatar?: string | null;
    socialLinks?: {
        twitter?: string | null;
        github?: string | null;
        linkedin?: string | null;
    };
}

export interface UpdateSettingsRequest {
    blogTitle?: string;
    blogDescription?: string;
    authorName?: string;
    authorBio?: string;
    authorAvatar?: string | null;
    socialLinks?: {
        twitter?: string | null;
        github?: string | null;
        linkedin?: string | null;
    };
}

// ============================================
// Upload Types
// ============================================

export interface UploadResponseData {
    url: string;
    filename: string;
    size: number;
    mimeType: string;
}
