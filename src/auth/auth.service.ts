import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { LoginResponse, ProfileResponse, RegisterResponse } from './dto/auth.dto';
import { User } from 'src/user/user.entity';
import { Request } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async signup(signupDto: SignUpDto): Promise<RegisterResponse> {
        const { email, password, fullName } = signupDto;

        const existingUser = await this.userService.findByEmail(email);
        if (existingUser) {
            throw new UnauthorizedException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await this.userService.create({
            email,
            password: hashedPassword,
            fullName,
        });

        const savedUser = await this.userService.save(newUser);

        return {
            message: 'Registration successful',
            user: {
                id: savedUser.id,
                email: savedUser.email,
                fullName: savedUser.fullName,
            },
        };
    }

    async validateUser(login: string, password: string): Promise<User> {
        const user = await this.userService.findByEmail(login);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }

    getProfile(req: any): ProfileResponse {
        const user = req.user;
        if (!user) {
            throw new UnauthorizedException('User not logged in');
        }

        return {
            message: 'User profile fetched successfully',
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
            },
        };
    }

    private generateAccessToken(user: User): string {
        return this.jwtService.sign(
            { id: user.id, email: user.email, fullName: user.fullName },
            {
                secret: process.env.JWT_SECRET_KEY,
                expiresIn: '15m',
            },
        );
    }

    private generateRefreshToken(user: User): string {
        return this.jwtService.sign(
            { id: user.id, email: user.email },
            {
                secret: process.env.JWT_REFRESH_SECRET_KEY,
                expiresIn: '7d',
            },
        );
    }

    async login(loginDto: LoginUserDto): Promise<LoginResponse> {
        const user = await this.validateUser(loginDto.login, loginDto.password);

        const accessToken = this.generateAccessToken(user);
        const refreshToken = this.generateRefreshToken(user);

        return {
            message: 'Login successful',
            accessToken,
            refreshToken,
        };
    }

    logout(): string {
        return 'Logout successful';
    }

    async refreshAccessToken(req: Request): Promise<{ accessToken: string }> {
        const refreshToken = req.cookies['refreshToken'];
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token missing');
        }

        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET_KEY,
            });

            const user = await this.userService.findById(payload.id);
            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            const newAccessToken = this.generateAccessToken(user);
            return { accessToken: newAccessToken };
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

}
