import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { TagsService } from './tags.service.js';
import { CreateTagDto } from './dto/create-tag.dto.js';
import { UpdateTagDto } from './dto/update-tag.dto.js';

@ApiTags('Tags')
@ApiBearerAuth()
@Controller('admin/tags')
@UseGuards(JwtAuthGuard)
export class TagsController {
    constructor(private readonly tagsService: TagsService) { }

    @Get()
    @ApiOperation({ summary: 'Get all tags with article counts' })
    async findAll() {
        const tags = await this.tagsService.findAll();
        return {
            success: true,
            data: tags,
        };
    }

    @Post()
    @ApiOperation({ summary: 'Create a new tag' })
    async create(@Body() createTagDto: CreateTagDto) {
        const tag = await this.tagsService.create(createTagDto);
        return {
            success: true,
            data: tag,
        };
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a tag' })
    async update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
        const tag = await this.tagsService.update(id, updateTagDto);
        return {
            success: true,
            data: tag,
        };
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a tag' })
    async delete(@Param('id') id: string) {
        await this.tagsService.delete(id);
        return {
            success: true,
            message: 'Tag deleted successfully',
        };
    }
}
