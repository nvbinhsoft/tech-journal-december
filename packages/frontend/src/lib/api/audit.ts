
import { api } from './client';
import type { Pagination } from './types';

export interface AuditLog {
    id: string;
    ip: string;
    userAgent: string;
    endpoint: string;
    method: string;
    referrer?: string;
    screenResolution?: string;
    metadata?: Record<string, any>;
    visitedAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface GetAuditLogsResponse {
    success: boolean;
    data: AuditLog[];
    pagination: Pagination;
}

export const auditApi = {
    recordVisit: async (data: { endpoint?: string, userAgent?: string, referrer?: string, screenResolution?: string }) => {
        return api.post<{ success: boolean; id: string }>('/audit', data);
    },

    getAuditLogs: async (params: { page?: number; limit?: number } = {}) => {
        const query = new URLSearchParams();
        if (params.page) query.append('page', params.page.toString());
        if (params.limit) query.append('limit', params.limit.toString());

        return api.get<GetAuditLogsResponse>(`/admin/audit?${query.toString()}`, true);
    },
};
