import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { SettingsService } from './settings.service.js';
import { UpdateSettingsDto } from './dto/update-settings.dto.js';

@ApiTags('Settings')
@ApiBearerAuth()
@Controller('admin/settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    @Get()
    @ApiOperation({ summary: 'Get blog settings' })
    async get() {
        const settings = await this.settingsService.get();
        return {
            success: true,
            data: settings,
        };
    }

    @Put()
    @ApiOperation({ summary: 'Update blog settings' })
    async update(@Body() updateSettingsDto: UpdateSettingsDto) {
        const settings = await this.settingsService.update(updateSettingsDto);
        return {
            success: true,
            data: settings,
        };
    }
}
