import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IArticle extends Document {
    _id: Types.ObjectId;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string | null;
    tags: Types.ObjectId[];
    published: boolean;
    readingTime: number;
    createdAt: Date;
    updatedAt: Date;
}

const ArticleSchema = new Schema<IArticle>(
    {
        title: {
            type: String,
            required: true,
            maxlength: 200,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: /^[a-z0-9-]+$/,
        },
        excerpt: {
            type: String,
            required: true,
            maxlength: 500,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        coverImage: {
            type: String,
            default: null,
        },
        tags: [{
            type: Schema.Types.ObjectId,
            ref: 'Tag',
        }],
        published: {
            type: Boolean,
            default: false,
        },
        readingTime: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// Create indexes
ArticleSchema.index({ slug: 1 }, { unique: true });
ArticleSchema.index({ published: 1, createdAt: -1 });
ArticleSchema.index({ tags: 1 });
ArticleSchema.index({ createdAt: -1 });
ArticleSchema.index(
    { title: 'text', excerpt: 'text', content: 'text' },
    { weights: { title: 10, excerpt: 5, content: 1 } }
);

// Calculate reading time before saving
ArticleSchema.pre('save', function (next) {
    if (this.isModified('content')) {
        const plainText = this.content.replace(/<[^>]*>/g, '');
        const wordCount = plainText.split(/\s+/).filter((word) => word).length;
        this.readingTime = Math.max(1, Math.ceil(wordCount / 200));
    }
    next();
});

// Transform output
ArticleSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        if (Array.isArray(ret.tags) && ret.tags.length > 0 && ret.tags[0] instanceof Types.ObjectId) {
            ret.tags = ret.tags.map((tag: Types.ObjectId) => tag.toString());
        }
        return ret;
    },
});

export const Article = mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema);
