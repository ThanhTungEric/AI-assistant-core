import { Body, Controller, Post, Req, Get, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { LoginResponse, RegisterResponse } from './dto/auth.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Response } from 'express';

@Controller('users/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    async signup(@Body() signupDto: SignUpDto): Promise<RegisterResponse> {
        return this.authService.signup(signupDto);
    }

    @Post('login')
    async login(@Body() loginDto: LoginUserDto, @Res() res: Response) {
        const { accessToken, refreshToken, message } = await this.authService.login(loginDto);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({ message, accessToken });
    }

    @Post('refresh')
    async refresh(@Req() req: Request) {
        return this.authService.refreshAccessToken(req);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Req() req: Request) {
        return this.authService.getProfile(req);
    }

    @Post('logout')
    async logout(@Res() res: Response) {
        res.clearCookie('refreshToken');
        return res.json({ message: 'Logout successful' });
    }
}
