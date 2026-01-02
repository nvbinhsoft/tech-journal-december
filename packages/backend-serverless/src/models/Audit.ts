
import mongoose, { Document, Schema } from 'mongoose';

export interface IAudit extends Document {
    ip: string;
    userAgent: string;
    endpoint: string;
    method: string;
    metadata?: Record<string, any>;
    visitedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const AuditSchema = new Schema(
    {
        ip: {
            type: String,
            required: true,
            index: true,
        },
        userAgent: {
            type: String,
            default: '',
        },
        endpoint: {
            type: String,
            default: '',
        },
        method: {
            type: String,
            default: '',
        },
        referrer: {
            type: String,
            required: false,
        },
        screenResolution: {
            type: String,
            required: false,
        },
        metadata: {
            type: Schema.Types.Mixed,
            default: {},
        },
        visitedAt: {
            type: Date,
            default: Date.now,
            index: -1, // Descending index for sorting
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: function (_doc, ret: any) {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
            },
        },
    }
);

// Prevent compiling model multple times (serverless cold starts)
export const Audit = mongoose.models.Audit || mongoose.model<IAudit>('Audit', AuditSchema);
