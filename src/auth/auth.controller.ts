import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { LocalGuard } from './guards/local.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('users/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    async signup(@Body() signupDto: SignUpDto) {
        return this.authService.signup(signupDto);
    }

    @UseGuards(LocalGuard)
    @Post('login')
    async login(@Req() req: Request, @Body() loginDto: LoginUserDto) {
        return this.authService.login(req, loginDto);
    }

    @Post('logout')
    async logout(@Req() req: Request): Promise<{ message: string }> {
        return this.authService.logout(req);
    }

    @Get('profile')
    getProfile(@Req() req: Request): { user: { id: number; email: string; username: string } } {
        return this.authService.getProfile(req);
    }

    @Post('forgot-password')
    async forgotPassword(@Body('email') email: string) {
        return this.authService.forgotPassword(email);
    }

    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }
}
