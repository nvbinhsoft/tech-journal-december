import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './config/configuration.js';
import { UsersModule } from './users/users.module.js';
import { ArticlesModule } from './articles/articles.module.js';
import { TagsModule } from './tags/tags.module.js';
import { SettingsModule } from './settings/settings.module.js';
import { AuthModule } from './auth/auth.module.js';
import { PublicModule } from './public/public.module.js';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    // MongoDB Connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),

    // Feature Modules
    UsersModule,
    ArticlesModule,
    TagsModule,
    SettingsModule,
    AuthModule,
    PublicModule,
  ],
})
export class AppModule { }
