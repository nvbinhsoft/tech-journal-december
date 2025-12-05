import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'Admin login' })
    async login(@Body() loginDto: LoginDto) {
        const result = await this.authService.login(loginDto.email, loginDto.password);
        return {
            success: true,
            data: result,
        };
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Admin logout' })
    async logout() {
        // JWT is stateless, so we just return success
        // Client should remove the token from storage
        return {
            success: true,
            message: 'Logged out successfully',
        };
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user' })
    async me(@Request() req: any) {
        const user = await this.authService.getCurrentUser(req.user.sub);
        return {
            success: true,
            data: user,
        };
    }
}
