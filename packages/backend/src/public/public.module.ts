import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PublicController } from './public.controller.js';
import { ArticlesModule } from '../articles/articles.module.js';
import { TagsModule } from '../tags/tags.module.js';
import { SettingsModule } from '../settings/settings.module.js';
import { Article, ArticleSchema } from '../articles/schemas/article.schema.js';
import { Tag, TagSchema } from '../tags/schemas/tag.schema.js';
import { Settings, SettingsSchema } from '../settings/schemas/settings.schema.js';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Article.name, schema: ArticleSchema },
            { name: Tag.name, schema: TagSchema },
            { name: Settings.name, schema: SettingsSchema },
        ]),
        ArticlesModule,
        TagsModule,
        SettingsModule,
    ],
    controllers: [PublicController],
})
export class PublicModule { }
