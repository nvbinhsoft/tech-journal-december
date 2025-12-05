import { IsString, IsOptional, IsBoolean, IsArray, MaxLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateArticleDto {
    @ApiProperty({ example: 'My New Article', maxLength: 200 })
    @IsString()
    @MaxLength(200)
    title!: string;

    @ApiProperty({ example: 'my-new-article', pattern: '^[a-z0-9-]+$' })
    @IsString()
    @Matches(/^[a-z0-9-]+$/, { message: 'Slug must contain only lowercase letters, numbers, and hyphens' })
    slug!: string;

    @ApiProperty({ example: 'A brief description of the article...', maxLength: 500 })
    @IsString()
    @MaxLength(500)
    excerpt!: string;

    @ApiProperty({ example: '<p>Article content here...</p>' })
    @IsString()
    content!: string;

    @ApiPropertyOptional({ example: 'https://example.com/images/cover.jpg' })
    @IsOptional()
    @IsString()
    coverImage?: string | null;

    @ApiProperty({ example: ['tag-id-1', 'tag-id-2'], type: [String] })
    @IsArray()
    @IsString({ each: true })
    tags!: string[];

    @ApiPropertyOptional({ example: false, default: false })
    @IsOptional()
    @IsBoolean()
    published?: boolean;
}
