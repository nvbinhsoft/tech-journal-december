import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Settings, SettingsDocument } from './schemas/settings.schema.js';
import { UpdateSettingsDto } from './dto/update-settings.dto.js';

@Injectable()
export class SettingsService {
    constructor(
        @InjectModel(Settings.name) private settingsModel: Model<SettingsDocument>,
    ) { }

    async get(): Promise<SettingsDocument> {
        // Find existing settings or create default
        let settings = await this.settingsModel.findOne({ key: 'main' }).exec();

        if (!settings) {
            settings = new this.settingsModel({
                key: 'main',
                blogTitle: 'My Tech Blog',
                blogDescription: 'A blog about software engineering and technology.',
                authorName: 'Author Name',
                authorBio: '',
                authorAvatar: null,
                socialLinks: {
                    twitter: null,
                    github: null,
                    linkedin: null,
                },
            });
            await settings.save();
        }

        return settings;
    }

    async update(updateSettingsDto: UpdateSettingsDto): Promise<SettingsDocument> {
        const settings = await this.settingsModel.findOneAndUpdate(
            { key: 'main' },
            { $set: updateSettingsDto },
            { new: true, upsert: true, runValidators: true },
        ).exec();

        return settings!;
    }
}
