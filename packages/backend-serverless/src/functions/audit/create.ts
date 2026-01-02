
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

        // Extract IP: Prioritize CloudFront/Load Balancer headers
        // 1. CloudFront-Viewer-Address (Best for CloudFront)
        // 2. X-Forwarded-For (Standard proxy)
        // 3. X-Real-IP (Nginx/Alternative)
        // 4. Source IP (Direct)
        const cfViewerAddress = event.headers['cloudfront-viewer-address']; // Format: IP:Port
        const forwardedFor = event.headers['x-forwarded-for'];
        const realIp = event.headers['x-real-ip'];

        let ip = 'unknown';
        if (cfViewerAddress) {
            ip = cfViewerAddress.split(':')[0];
        } else if (forwardedFor) {
            ip = forwardedFor.split(',')[0].trim();
        } else if (realIp) {
            ip = realIp;
        } else {
            ip = event.requestContext?.http?.sourceIp || 'unknown';
        }

        // Extract User Agent
        const userAgent = body.userAgent || event.headers['user-agent'] || 'unknown';

        // Extract Referrer (Body takes precedence, then Header)
        const referrer = body.referrer || event.headers['referer'] || event.headers['referrer'];

        const audit = new Audit({
            ip,
            userAgent,
            endpoint: body.endpoint || 'unknown',
            method: event.requestContext?.http?.method || 'UNKNOWN',
            referrer,
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
