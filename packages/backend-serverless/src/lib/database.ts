import mongoose from 'mongoose';

let cachedConnection: typeof mongoose | null = null;

/**
 * Connect to MongoDB with connection caching for Lambda warm starts.
 * Reuses the same connection across invocations to avoid connection overhead.
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection;
    }

    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        throw new Error('MONGODB_URI environment variable is not set');
    }

    try {
        cachedConnection = await mongoose.connect(mongoUri, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log('Connected to MongoDB');
        return cachedConnection;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}
