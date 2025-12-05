import { IsString, IsOptional, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

class SocialLinksDto {
    @ApiPropertyOptional({ example: 'https://twitter.com/username' })
    @IsOptional()
    @IsString()
    twitter?: string | null;

    @ApiPropertyOptional({ example: 'https://github.com/username' })
    @IsOptional()
    @IsString()
    github?: string | null;

    @ApiPropertyOptional({ example: 'https://linkedin.com/in/username' })
    @IsOptional()
    @IsString()
    linkedin?: string | null;
}

export class UpdateSettingsDto {
    @ApiPropertyOptional({ example: 'My Tech Blog', maxLength: 100 })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    blogTitle?: string;

    @ApiPropertyOptional({ example: 'A blog about software engineering...', maxLength: 500 })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    blogDescription?: string;

    @ApiPropertyOptional({ example: 'John Doe', maxLength: 100 })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    authorName?: string;

    @ApiPropertyOptional({ example: 'Software engineer passionate about...', maxLength: 1000 })
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    authorBio?: string;

    @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
    @IsOptional()
    @IsString()
    authorAvatar?: string | null;

    @ApiPropertyOptional({ type: SocialLinksDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => SocialLinksDto)
    socialLinks?: SocialLinksDto;
}
