import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ArticlesService } from '../articles/articles.service.js';
import { TagsService } from '../tags/tags.service.js';
import { SettingsService } from '../settings/settings.service.js';
import { ArticleQueryDto } from '../articles/dto/article-query.dto.js';

@ApiTags('Public')
@Controller('public')
export class PublicController {
    constructor(
        private readonly articlesService: ArticlesService,
        private readonly tagsService: TagsService,
        private readonly settingsService: SettingsService,
    ) { }

    @Get('articles')
    @ApiOperation({ summary: 'Get published articles' })
    async getArticles(@Query() query: ArticleQueryDto) {
        const result = await this.articlesService.findAll(query, false);
        return {
            success: true,
            data: result.data,
            pagination: result.pagination,
        };
    }

    @Get('articles/:slug')
    @ApiOperation({ summary: 'Get published article by slug' })
    async getArticleBySlug(@Param('slug') slug: string) {
        const article = await this.articlesService.findBySlug(slug, true);
        return {
            success: true,
            data: article,
        };
    }

    @Get('tags')
    @ApiOperation({ summary: 'Get all tags' })
    async getTags() {
        const tags = await this.tagsService.findAll();
        return {
            success: true,
            data: tags,
        };
    }

    @Get('settings')
    @ApiOperation({ summary: 'Get blog settings' })
    async getSettings() {
        const settings = await this.settingsService.get();
        return {
            success: true,
            data: settings,
        };
    }
}
