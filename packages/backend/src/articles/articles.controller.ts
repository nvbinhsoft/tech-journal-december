import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { ArticlesService } from './articles.service.js';
import { CreateArticleDto } from './dto/create-article.dto.js';
import { UpdateArticleDto } from './dto/update-article.dto.js';
import { ArticleQueryDto } from './dto/article-query.dto.js';

@ApiTags('Articles')
@ApiBearerAuth()
@Controller('admin/articles')
@UseGuards(JwtAuthGuard)
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) { }

    @Get()
    @ApiOperation({ summary: 'Get all articles (including drafts)' })
    async findAll(@Query() query: ArticleQueryDto) {
        const result = await this.articlesService.findAll(query, true);
        return {
            success: true,
            data: result.data,
            pagination: result.pagination,
        };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get article by ID' })
    async findOne(@Param('id') id: string) {
        const article = await this.articlesService.findById(id);
        return {
            success: true,
            data: article,
        };
    }

    @Post()
    @ApiOperation({ summary: 'Create a new article' })
    async create(@Body() createArticleDto: CreateArticleDto) {
        const article = await this.articlesService.create(createArticleDto);
        return {
            success: true,
            data: article,
        };
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update an article' })
    async update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
        const article = await this.articlesService.update(id, updateArticleDto);
        return {
            success: true,
            data: article,
        };
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an article' })
    async delete(@Param('id') id: string) {
        await this.articlesService.delete(id);
        return {
            success: true,
            message: 'Article deleted successfully',
        };
    }
}
