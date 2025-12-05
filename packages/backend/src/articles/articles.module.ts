import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from './schemas/article.schema.js';
import { ArticlesService } from './articles.service.js';
import { ArticlesController } from './articles.controller.js';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
    ],
    controllers: [ArticlesController],
    providers: [ArticlesService],
    exports: [ArticlesService],
})
export class ArticlesModule { }
