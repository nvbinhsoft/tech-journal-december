console.log('🔥 LAMBDA_FILE_LOADED: Initializing script engine...');
import 'reflect-metadata';
import serverlessExpress from '@vendia/serverless-express';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import express from 'express';
import { AppModule } from './app.module.js';

// Cache the server instance for warm Lambda invocations
let cachedServer: ReturnType<typeof serverlessExpress> | null = null;

async function bootstrap() {
    console.log('🚀 Bootstrapping NestJS application...');
    if (cachedServer) {
        console.log('♻️ Using cached server instance');
        return cachedServer;
    }

    try {
        const expressApp = express();
        console.log('📦 Creating NestJS app instance...');
        const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), {
            logger: ['error', 'warn', 'log', 'debug', 'verbose'],
        });

        const configService = app.get(ConfigService);
        const apiPrefix = configService.get<string>('apiPrefix') ?? 'v1';
        console.log(`🔗 API Prefix: ${apiPrefix}`);

        // Set global prefix for all routes
        app.setGlobalPrefix(apiPrefix);

        // Enable CORS
        app.enableCors({
            origin: true,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            credentials: true,
        });

        // Global validation pipe
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
                transformOptions: { enableImplicitConversion: true },
            }),
        );

        console.log('🏗️ Initializing NestJS app...');
        await app.init();
        console.log('✅ NestJS app initialized successfully');

        cachedServer = serverlessExpress({ app: expressApp });
        return cachedServer;
    } catch (error) {
        console.error('❌ Error during bootstrap:', error);
        throw error;
    }
}

// Lambda handler function
export const handler = async (
    event: any,
    context: any,
    callback: any,
) => {
    console.log('📥 Lambda Request received:', JSON.stringify(event.path || event.url || 'root'));
    try {
        const server = await bootstrap();
        return await server(event, context, callback);
    } catch (error: any) {
        console.error('💥 Critical Error in Handler:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Internal Server Error during Lambda execution',
                error: error.message,
                stack: error.stack,
            }),
        };
    }
};
