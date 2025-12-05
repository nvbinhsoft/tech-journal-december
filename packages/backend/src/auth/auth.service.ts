import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service.js';

export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
}

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await this.usersService.validatePassword(
            password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }

    async login(email: string, password: string) {
        const user = await this.validateUser(email, password);

        const payload: JwtPayload = {
            sub: user._id.toHexString(),
            email: user.email,
            role: user.role,
        };

        const accessToken = this.jwtService.sign(payload);
        const expiresIn = this.configService.get<number>('jwt.expiresIn') ?? 3600;

        return {
            accessToken,
            expiresIn,
            user: {
                id: user._id.toHexString(),
                email: user.email,
                role: user.role,
                createdAt: (user as any).createdAt,
            },
        };
    }

    async getCurrentUser(userId: string) {
        const user = await this.usersService.findById(userId);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return {
            id: user._id.toHexString(),
            email: user.email,
            role: user.role,
            createdAt: (user as any).createdAt,
        };
    }
}
