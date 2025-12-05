import { IsOptional, IsString, IsBoolean, IsInt, Min, Max, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ArticleQueryDto {
    @ApiPropertyOptional({ description: 'Search query for title, excerpt, or content' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ description: 'Filter by tag IDs (comma-separated)' })
    @IsOptional()
    @IsString()
    tags?: string;

    @ApiPropertyOptional({ description: 'Filter by published status' })
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    published?: boolean;

    @ApiPropertyOptional({ description: 'Page number', default: 1, minimum: 1 })
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ description: 'Items per page', default: 10, minimum: 1, maximum: 100 })
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @ApiPropertyOptional({ description: 'Sort field', default: 'createdAt', enum: ['createdAt', 'updatedAt', 'title'] })
    @IsOptional()
    @IsIn(['createdAt', 'updatedAt', 'title'])
    sortBy?: 'createdAt' | 'updatedAt' | 'title' = 'createdAt';

    @ApiPropertyOptional({ description: 'Sort order', default: 'desc', enum: ['asc', 'desc'] })
    @IsOptional()
    @IsIn(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc' = 'desc';
}
