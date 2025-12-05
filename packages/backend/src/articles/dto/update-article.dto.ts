import { IsString, IsOptional, IsBoolean, IsArray, MaxLength, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateArticleDto {
    @ApiPropertyOptional({ example: 'Updated Article Title', maxLength: 200 })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    title?: string;

    @ApiPropertyOptional({ example: 'updated-article-title', pattern: '^[a-z0-9-]+$' })
    @IsOptional()
    @IsString()
    @Matches(/^[a-z0-9-]+$/, { message: 'Slug must contain only lowercase letters, numbers, and hyphens' })
    slug?: string;

    @ApiPropertyOptional({ example: 'Updated description...', maxLength: 500 })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    excerpt?: string;

    @ApiPropertyOptional({ example: '<p>Updated content...</p>' })
    @IsOptional()
    @IsString()
    content?: string;

    @ApiPropertyOptional({ example: 'https://example.com/images/new-cover.jpg' })
    @IsOptional()
    @IsString()
    coverImage?: string | null;

    @ApiPropertyOptional({ example: ['tag-id-1', 'tag-id-2'], type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    published?: boolean;
}
