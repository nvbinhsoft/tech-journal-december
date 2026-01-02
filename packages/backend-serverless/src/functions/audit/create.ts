
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { connectToDatabase } from '../../lib/database.js';
import { created, error, serverError } from '../../lib/response.js';
import { Audit } from '../../models/Audit.js';

interface CreateAuditBody {
    endpoint?: string;
    userAgent?: string;
    referrer?: string;
    screenResolution?: string;
    metadata?: Record<string, any>;
}

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
        await connectToDatabase();

        const body = event.body ? JSON.parse(event.body) as CreateAuditBody : {};

        // Extract IP: Prioritize X-Forwarded-For (standard for proxies/CloudFront)
        const forwardedFor = event.headers['x-forwarded-for'];
        const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : (event.requestContext?.http?.sourceIp || 'unknown');

        // Extract User Agent
        const userAgent = body.userAgent || event.headers['user-agent'] || 'unknown';

        const audit = new Audit({
            ip,
            userAgent,
            endpoint: body.endpoint || 'unknown',
            method: event.requestContext?.http?.method || 'UNKNOWN',
            referrer: body.referrer,
            screenResolution: body.screenResolution,
            metadata: body.metadata || {},
        });

        await audit.save();

        return created({ success: true, id: audit._id.toString() });
    } catch (err) {
        if (err instanceof SyntaxError) {
            return error('Invalid JSON body', 400);
        }
        return serverError(err);
    }
};
