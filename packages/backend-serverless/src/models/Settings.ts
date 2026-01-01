import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISocialLinks {
    twitter?: string;
    github?: string;
    linkedin?: string;
}

export interface ISettings extends Document {
    _id: Types.ObjectId;
    blogTitle: string;
    blogDescription: string;
    authorName: string;
    authorBio: string;
    authorAvatar: string | null;
    socialLinks: ISocialLinks;
    createdAt: Date;
    updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
    {
        blogTitle: {
            type: String,
            required: true,
            trim: true,
            default: 'Tech Journal',
        },
        blogDescription: {
            type: String,
            required: true,
            trim: true,
            default: 'A personal blog about technology and software development',
        },
        authorName: {
            type: String,
            required: true,
            trim: true,
            default: 'Admin',
        },
        authorBio: {
            type: String,
            trim: true,
            default: '',
        },
        authorAvatar: {
            type: String,
            default: null,
        },
        socialLinks: {
            twitter: { type: String, default: '' },
            github: { type: String, default: '' },
            linkedin: { type: String, default: '' },
        },
    },
    { timestamps: true }
);

// Transform output
SettingsSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
    },
});

export const Settings = mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
