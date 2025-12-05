import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Tag } from '../../tags/schemas/tag.schema.js';

export type ArticleDocument = HydratedDocument<Article>;

@Schema({ timestamps: true })
export class Article {
    @Prop({
        required: true,
        maxlength: 200,
        trim: true,
    })
    title!: string;

    @Prop({
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: /^[a-z0-9-]+$/,
    })
    slug!: string;

    @Prop({
        required: true,
        maxlength: 500,
        trim: true,
    })
    excerpt!: string;

    @Prop({
        required: true,
    })
    content!: string;

    @Prop({
        type: String,
        default: null,
    })
    coverImage!: string | null;

    @Prop({
        type: [{ type: Types.ObjectId, ref: 'Tag' }],
        default: [],
    })
    tags!: Types.ObjectId[];

    @Prop({
        type: Boolean,
        default: false,
    })
    published!: boolean;

    @Prop({
        type: Number,
        default: 0,
    })
    readingTime!: number;

    // Virtual field for id
    id?: string;

    // Virtual field for populated tags
    tagDetails?: Tag[];
}

export const ArticleSchema = SchemaFactory.createForClass(Article);

// Add virtual id field
ArticleSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Virtual for populated tag details
ArticleSchema.virtual('tagDetails', {
    ref: 'Tag',
    localField: 'tags',
    foreignField: '_id',
});

// Create indexes
ArticleSchema.index({ slug: 1 }, { unique: true });
ArticleSchema.index({ published: 1, createdAt: -1 });
ArticleSchema.index({ tags: 1 });
ArticleSchema.index({ createdAt: -1 });
ArticleSchema.index({ updatedAt: -1 });
ArticleSchema.index(
    { title: 'text', excerpt: 'text', content: 'text' },
    { weights: { title: 10, excerpt: 5, content: 1 } },
);

// Calculate reading time before saving
ArticleSchema.pre('save', function (next) {
    if (this.isModified('content')) {
        // Strip HTML tags and count words
        const plainText = this.content.replace(/<[^>]*>/g, '');
        const wordCount = plainText.split(/\s+/).filter((word) => word).length;
        // Average reading speed: 200 words per minute
        this.readingTime = Math.max(1, Math.ceil(wordCount / 200));
    }
    next();
});

// Ensure virtuals are included in JSON output
ArticleSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => {
        const obj = ret as unknown as Record<string, unknown>;
        const { _id, ...rest } = obj;
        // Convert tag ObjectIds to strings if not populated
        if (Array.isArray(rest.tags) && rest.tags.length > 0 && rest.tags[0] instanceof Types.ObjectId) {
            rest.tags = (rest.tags as Types.ObjectId[]).map((tag) => tag.toHexString());
        }
        return rest;
    },
});

ArticleSchema.set('toObject', {
    virtuals: true,
});
