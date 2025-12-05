import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Article, ArticleDocument } from './schemas/article.schema.js';
import { CreateArticleDto } from './dto/create-article.dto.js';
import { UpdateArticleDto } from './dto/update-article.dto.js';
import { ArticleQueryDto } from './dto/article-query.dto.js';

@Injectable()
export class ArticlesService {
    constructor(
        @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
    ) { }

    async create(createArticleDto: CreateArticleDto): Promise<ArticleDocument> {
        const article = new this.articleModel({
            ...createArticleDto,
            tags: createArticleDto.tags?.map((id) => new Types.ObjectId(id)) ?? [],
        });
        return (await article.save()).populate('tagDetails');
    }

    async findAll(query: ArticleQueryDto, includeUnpublished = false) {
        const {
            search,
            tags,
            published,
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = query;

        // Build filter
        const filter: Record<string, unknown> = {};

        // Only show published articles for public access
        if (!includeUnpublished) {
            filter.published = true;
        } else if (published !== undefined) {
            filter.published = published;
        }

        // Tag filter
        if (tags) {
            const tagIds = tags.split(',').map((id) => new Types.ObjectId(id.trim()));
            filter.tags = { $in: tagIds };
        }

        // Text search
        if (search) {
            filter.$text = { $search: search };
        }

        // Execute query with pagination
        const skip = (page - 1) * limit;
        const sortDirection = sortOrder === 'asc' ? 1 : -1;

        const [articles, total] = await Promise.all([
            this.articleModel
                .find(filter)
                .populate('tagDetails')
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.articleModel.countDocuments(filter).exec(),
        ]);

        return {
            data: articles,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findById(id: string): Promise<ArticleDocument> {
        const article = await this.articleModel
            .findById(id)
            .populate('tagDetails')
            .exec();

        if (!article) {
            throw new NotFoundException('Article not found');
        }

        return article;
    }

    async findBySlug(slug: string, mustBePublished = true): Promise<ArticleDocument> {
        const filter: Record<string, unknown> = { slug };
        if (mustBePublished) {
            filter.published = true;
        }

        const article = await this.articleModel
            .findOne(filter)
            .populate('tagDetails')
            .exec();

        if (!article) {
            throw new NotFoundException('Article not found');
        }

        return article;
    }

    async update(id: string, updateArticleDto: UpdateArticleDto): Promise<ArticleDocument> {
        const updateData: Record<string, unknown> = { ...updateArticleDto };

        // Convert tag IDs to ObjectIds if provided
        if (updateArticleDto.tags) {
            updateData.tags = updateArticleDto.tags.map((tagId) => new Types.ObjectId(tagId));
        }

        const article = await this.articleModel
            .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
            .populate('tagDetails')
            .exec();

        if (!article) {
            throw new NotFoundException('Article not found');
        }

        // Recalculate reading time if content was updated
        if (updateArticleDto.content) {
            await article.save();
        }

        return article;
    }

    async delete(id: string): Promise<void> {
        const result = await this.articleModel.findByIdAndDelete(id).exec();

        if (!result) {
            throw new NotFoundException('Article not found');
        }
    }
}
