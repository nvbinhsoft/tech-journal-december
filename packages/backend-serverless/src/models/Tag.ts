import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITag extends Document {
    _id: Types.ObjectId;
    name: string;
    slug: string;
    color: string;
    createdAt: Date;
    updatedAt: Date;
}

const TagSchema = new Schema<ITag>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            maxlength: 50,
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
        color: {
            type: String,
            required: true,
            match: /^#[0-9A-Fa-f]{6}$/,
            default: '#3B82F6',
        },
    },
    { timestamps: true }
);

// Create indexes
TagSchema.index({ name: 1 }, { unique: true });
TagSchema.index({ slug: 1 }, { unique: true });

// Transform output
TagSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
    },
});

export const Tag = mongoose.models.Tag || mongoose.model<ITag>('Tag', TagSchema);
