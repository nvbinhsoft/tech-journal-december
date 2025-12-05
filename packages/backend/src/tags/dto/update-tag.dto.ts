import { IsString, IsOptional, MaxLength, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTagDto {
    @ApiPropertyOptional({ example: 'Updated Tag Name', maxLength: 50 })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    name?: string;

    @ApiPropertyOptional({ example: 'updated-tag-name', pattern: '^[a-z0-9-]+$' })
    @IsOptional()
    @IsString()
    @Matches(/^[a-z0-9-]+$/, { message: 'Slug must contain only lowercase letters, numbers, and hyphens' })
    slug?: string;

    @ApiPropertyOptional({ example: '#FF5733', pattern: '^#[0-9A-Fa-f]{6}$' })
    @IsOptional()
    @IsString()
    @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'Color must be a valid hex color code (e.g., #FF5733)' })
    color?: string;
}
