import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    })
    email!: string;

    @Prop({
        required: true,
        minlength: 8,
        select: false, // Don't return password by default
    })
    password!: string;

    @Prop({
        type: String,
        enum: ['admin'],
        default: 'admin',
    })
    role!: 'admin';

    // Virtual field for id (converts _id ObjectId to string)
    id?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add virtual id field
UserSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtuals are included in JSON output
UserSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => {
        const { _id, password, ...rest } = ret;
        return rest;
    },
});

UserSchema.set('toObject', {
    virtuals: true,
});
