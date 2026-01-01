import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { connectToDatabase } from '../../../lib/database.js';
import { verifyToken } from '../../../lib/auth.js';
import { success, unauthorized, serverError } from '../../../lib/response.js';
import { Tag } from '../../../models/Tag.js';
import { Article } from '../../../models/Article.js';

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
        // Verify JWT
        const user = verifyToken(event);
        if (!user) {
            return unauthorized();
        }

        await connectToDatabase();

        // Get all tags
        const tags = await Tag.find().lean();

        // Get article counts per tag (all articles, not just published)
        const tagCounts = await Article.aggregate([
            { $unwind: '$tags' },
            { $group: { _id: '$tags', count: { $sum: 1 } } },
        ]);

        // Create a map for quick lookup
        const countMap = new Map(
            tagCounts.map((item) => [item._id.toString(), item.count])
        );

        // Transform tags with article counts
        const transformedTags = tags.map((tag) => ({
            ...tag,
            id: tag._id.toString(),
            _id: undefined,
            articleCount: countMap.get(tag._id.toString()) || 0,
        }));

        return success(transformedTags);
    } catch (err) {
        return serverError(err);
    }
};
