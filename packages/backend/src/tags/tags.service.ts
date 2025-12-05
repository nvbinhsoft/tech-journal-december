import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tag, TagDocument } from './schemas/tag.schema.js';
import { CreateTagDto } from './dto/create-tag.dto.js';
import { UpdateTagDto } from './dto/update-tag.dto.js';
import { Article } from '../articles/schemas/article.schema.js';

@Injectable()
export class TagsService {
    constructor(
        @InjectModel(Tag.name) private tagModel: Model<TagDocument>,
        @InjectModel(Article.name) private articleModel: Model<Article>,
    ) { }

    async create(createTagDto: CreateTagDto): Promise<TagDocument> {
        try {
            const tag = new this.tagModel(createTagDto);
            return await tag.save();
        } catch (error: unknown) {
            if (error instanceof Error && 'code' in error && (error as { code: number }).code === 11000) {
                throw new ConflictException('Tag with this name or slug already exists');
            }
            throw error;
        }
    }

    async findAll(): Promise<Array<Tag & { articleCount: number }>> {
        // Get all tags with article count using aggregation
        const tags = await this.tagModel.aggregate([
            {
                $lookup: {
                    from: 'articles',
                    localField: '_id',
                    foreignField: 'tags',
                    as: 'articles',
                },
            },
            {
                $addFields: {
                    id: { $toString: '$_id' },
                    articleCount: { $size: '$articles' },
                },
            },
            {
                $project: {
                    _id: 0,
                    id: 1,
                    name: 1,
                    slug: 1,
                    color: 1,
                    articleCount: 1,
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
        ]);

        return tags;
    }

    async findById(id: string): Promise<TagDocument> {
        const tag = await this.tagModel.findById(id).exec();

        if (!tag) {
            throw new NotFoundException('Tag not found');
        }

        return tag;
    }

    async update(id: string, updateTagDto: UpdateTagDto): Promise<TagDocument> {
        try {
            const tag = await this.tagModel
                .findByIdAndUpdate(id, updateTagDto, { new: true, runValidators: true })
                .exec();

            if (!tag) {
                throw new NotFoundException('Tag not found');
            }

            return tag;
        } catch (error: unknown) {
            if (error instanceof Error && 'code' in error && (error as { code: number }).code === 11000) {
                throw new ConflictException('Tag with this name or slug already exists');
            }
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        const result = await this.tagModel.findByIdAndDelete(id).exec();

        if (!result) {
            throw new NotFoundException('Tag not found');
        }

        // Remove tag reference from all articles
        await this.articleModel.updateMany(
            { tags: new Types.ObjectId(id) },
            { $pull: { tags: new Types.ObjectId(id) } },
        );
    }
}
