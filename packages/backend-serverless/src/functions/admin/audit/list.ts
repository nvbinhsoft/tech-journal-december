
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { connectToDatabase } from '../../../lib/database.js';
import { successWithPagination, serverError, unauthorized } from '../../../lib/response.js';
import { Audit } from '../../../models/Audit.js';
import { getUserFromEvent } from '../../../lib/auth.js';

interface QueryParams {
    page?: string;
    limit?: string;
}

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
        await connectToDatabase();

        // Check authentication
        const user = await getUserFromEvent(event);
        if (!user || user.role !== 'admin') {
            return unauthorized('Admin access required');
        }

        const params = (event.queryStringParameters || {}) as QueryParams;
        const page = Math.max(1, parseInt(params.page || '1', 10));
        const limit = Math.min(100, Math.max(1, parseInt(params.limit || '20', 10)));
        const skip = (page - 1) * limit;

        const [logs, total] = await Promise.all([
            Audit.find()
                .sort({ visitedAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Audit.countDocuments(),
        ]);

        const transformedLogs = logs.map((log: any) => ({
            ...log,
            id: log._id.toString(),
            _id: undefined,
        }));

        const totalPages = Math.ceil(total / limit);

        return successWithPagination(transformedLogs, {
            page,
            limit,
            total,
            totalPages,
        });
    } catch (err) {
        return serverError(err);
    }
};
