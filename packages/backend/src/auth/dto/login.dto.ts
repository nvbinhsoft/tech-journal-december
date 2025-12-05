import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ example: 'admin@example.com' })
    @IsEmail({}, { message: 'Invalid email format' })
    email!: string;

    @ApiProperty({ example: 'securePassword123', minLength: 8 })
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    password!: string;
}
