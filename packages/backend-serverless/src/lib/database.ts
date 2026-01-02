import mongoose from 'mongoose';

let cachedConnection: typeof mongoose | null = null;
// Cache the promise, not just the connection, to handle concurrent cold starts
let cachedPromise: Promise<typeof mongoose> | null = null;

/**
 * Connect to MongoDB with connection caching for Lambda warm starts.
 * Reuses the same connection across invocations to avoid connection overhead.
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection;
    }

    if (cachedPromise) {
        cachedConnection = await cachedPromise;
        return cachedConnection!;
    }

    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        throw new Error('MONGODB_URI environment variable is not set');
    }

    try {
        cachedPromise = mongoose.connect(mongoUri, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            bufferCommands: false, // Return errors immediately if driver is not connected
        });

        cachedConnection = await cachedPromise;
        console.log('Connected to MongoDB');
        return cachedConnection;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        cachedPromise = null; // Reset promise on error so we try again next time
        throw error;
    }
}
