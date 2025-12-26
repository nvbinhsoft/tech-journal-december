// Lambda handler for AWS Lambda deployment
// Uses @vendia/serverless-express to wrap the NestJS Express app

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
    if (cachedServer) {
        return cachedServer;
    }

    const expressApp = express();
    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

    const configService = app.get(ConfigService);
    const apiPrefix = configService.get<string>('apiPrefix') ?? 'v1';

    // Set global prefix for all routes
    app.setGlobalPrefix(apiPrefix);

    // Enable CORS for CloudFront/frontend
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
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    await app.init();

    cachedServer = serverlessExpress({ app: expressApp });
    return cachedServer;
}

// Lambda handler function
export const handler = async (
    event: unknown,
    context: unknown,
    callback: unknown,
) => {
    const server = await bootstrap();
    return server(event, context, callback);
};
