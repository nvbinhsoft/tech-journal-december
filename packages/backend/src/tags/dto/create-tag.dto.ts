import { IsString, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
    @ApiProperty({ example: 'React', maxLength: 50 })
    @IsString()
    @MaxLength(50)
    name!: string;

    @ApiProperty({ example: 'react', pattern: '^[a-z0-9-]+$' })
    @IsString()
    @Matches(/^[a-z0-9-]+$/, { message: 'Slug must contain only lowercase letters, numbers, and hyphens' })
    slug!: string;

    @ApiProperty({ example: '#61DAFB', pattern: '^#[0-9A-Fa-f]{6}$' })
    @IsString()
    @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'Color must be a valid hex color code (e.g., #FF5733)' })
    color!: string;
}
