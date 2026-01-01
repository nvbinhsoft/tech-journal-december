import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { connectToDatabase } from '../../../lib/database.js';
import { verifyToken } from '../../../lib/auth.js';
import { success, error, unauthorized, parseBody, serverError } from '../../../lib/response.js';
import { Settings, type ISocialLinks } from '../../../models/Settings.js';

interface UpdateSettingsRequest {
    blogTitle?: string;
    blogDescription?: string;
    authorName?: string;
    authorBio?: string;
    authorAvatar?: string | null;
    socialLinks?: ISocialLinks;
}

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
        // Verify JWT
        const user = verifyToken(event);
        if (!user) {
            return unauthorized();
        }

        await connectToDatabase();

        const body = parseBody<UpdateSettingsRequest>(event.body);
        if (!body) {
            return error('Invalid request body');
        }

        // Find or create settings
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings({
                blogTitle: 'Tech Journal',
                blogDescription: 'A personal blog about technology and software development',
                authorName: 'Admin',
                authorBio: '',
                authorAvatar: null,
                socialLinks: {},
            });
        }

        // Update fields
        if (body.blogTitle !== undefined) settings.blogTitle = body.blogTitle;
        if (body.blogDescription !== undefined) settings.blogDescription = body.blogDescription;
        if (body.authorName !== undefined) settings.authorName = body.authorName;
        if (body.authorBio !== undefined) settings.authorBio = body.authorBio;
        if (body.authorAvatar !== undefined) settings.authorAvatar = body.authorAvatar;
        if (body.socialLinks !== undefined) {
            settings.socialLinks = {
                ...settings.socialLinks,
                ...body.socialLinks,
            };
        }

        await settings.save();

        return success({
            ...settings.toJSON(),
            id: settings._id.toString(),
        });
    } catch (err) {
        return serverError(err);
    }
};
