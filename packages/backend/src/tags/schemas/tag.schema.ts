import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TagDocument = HydratedDocument<Tag>;

@Schema({ timestamps: true })
export class Tag {
    @Prop({
        required: true,
        unique: true,
        maxlength: 50,
        trim: true,
    })
    name!: string;

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
        match: /^#[0-9A-Fa-f]{6}$/,
        default: '#3B82F6',
    })
    color!: string;

    // Virtual field for id
    id?: string;

    // Virtual field for article count (computed via aggregation)
    articleCount?: number;
}

export const TagSchema = SchemaFactory.createForClass(Tag);

// Add virtual id field
TagSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Create indexes
TagSchema.index({ name: 1 }, { unique: true });
TagSchema.index({ slug: 1 }, { unique: true });

// Ensure virtuals are included in JSON output
TagSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => {
        const { _id, ...rest } = ret;
        return rest;
    },
});

TagSchema.set('toObject', {
    virtuals: true,
});
