import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SettingsDocument = HydratedDocument<Settings>;

// Embedded schema for social links
class SocialLinks {
    @Prop({ type: String, default: null })
    twitter!: string | null;

    @Prop({ type: String, default: null })
    github!: string | null;

    @Prop({ type: String, default: null })
    linkedin!: string | null;
}

@Schema({ timestamps: true })
export class Settings {
    // Key field for singleton pattern
    @Prop({
        type: String,
        default: 'main',
        unique: true,
    })
    key!: string;

    @Prop({
        required: true,
        maxlength: 100,
        trim: true,
        default: 'My Tech Blog',
    })
    blogTitle!: string;

    @Prop({
        required: true,
        maxlength: 500,
        trim: true,
        default: 'A blog about software engineering and technology.',
    })
    blogDescription!: string;

    @Prop({
        required: true,
        maxlength: 100,
        trim: true,
        default: 'Author Name',
    })
    authorName!: string;

    @Prop({
        type: String,
        maxlength: 1000,
        trim: true,
        default: '',
    })
    authorBio!: string;

    @Prop({
        type: String,
        default: null,
    })
    authorAvatar!: string | null;

    @Prop({
        type: SocialLinks,
        default: () => ({
            twitter: null,
            github: null,
            linkedin: null,
        }),
    })
    socialLinks!: SocialLinks;

    // Virtual field for id
    id?: string;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);

// Add virtual id field
SettingsSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Create unique index on key for singleton pattern
SettingsSchema.index({ key: 1 }, { unique: true });

// Ensure virtuals are included in JSON output
SettingsSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => {
        const { _id, key, ...rest } = ret;
        return rest;
    },
});

SettingsSchema.set('toObject', {
    virtuals: true,
});
