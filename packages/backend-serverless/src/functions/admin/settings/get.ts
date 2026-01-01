import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { connectToDatabase } from '../../../lib/database.js';
import { verifyToken } from '../../../lib/auth.js';
import { success, unauthorized, serverError } from '../../../lib/response.js';
import { Settings } from '../../../models/Settings.js';

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
        // Verify JWT
        const user = verifyToken(event);
        if (!user) {
            return unauthorized();
        }

        await connectToDatabase();

        // Get settings (there should be only one document)
        let settings = await Settings.findOne().lean();

        // If no settings exist, create default
        if (!settings) {
            const defaultSettings = new Settings({
                blogTitle: 'Tech Journal',
                blogDescription: 'A personal blog about technology and software development',
                authorName: 'Admin',
                authorBio: '',
                authorAvatar: null,
                socialLinks: {},
            });
            await defaultSettings.save();
            settings = defaultSettings.toJSON();
        }

        // Transform settings
        const transformedSettings = {
            ...settings,
            id: (settings._id as { toString(): string }).toString(),
            _id: undefined,
        };

        return success(transformedSettings);
    } catch (err) {
        return serverError(err);
    }
};
