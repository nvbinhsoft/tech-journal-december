import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tag, TagSchema } from './schemas/tag.schema.js';
import { Article, ArticleSchema } from '../articles/schemas/article.schema.js';
import { TagsService } from './tags.service.js';
import { TagsController } from './tags.controller.js';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Tag.name, schema: TagSchema },
            { name: Article.name, schema: ArticleSchema },
        ]),
    ],
    controllers: [TagsController],
    providers: [TagsService],
    exports: [TagsService],
})
export class TagsModule { }
