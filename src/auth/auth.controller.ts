import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { SignUpDto } from './dto/signup-user.dto';
import { LocalGuard } from './guards/local.guard';
import { SessionGuard } from './guards/session.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';


@Controller('users/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post()
    // register a new user
    async signup(@Body() signupDto: SignUpDto) {
        return this.authService.signup(signupDto);
    }

    @UseGuards(LocalGuard)
    @Post('login')
    // login a user
    async login(@Req() req: Request, @Body() loginDto: LoginUserDto) {
        return this.authService.login(req, loginDto);
    }

    
    @Post('logout')
    // logout a user
    logout(@Req() req: Request, @Res() res: Response) {
        return this.authService.logout(req, res);
    }

    @UseGuards(SessionGuard)
    @Get('profile')
    // get the profile of the logged-in user (session)
    getProfile(@Req() req: Request): { session: any } {
        const user = req.session.user;
        if (!user || !req.session) {
            throw new UnauthorizedException('User not authenticated');
        }
        return { session: req.session };
    }

    @Post('forgot-password')
    async forgotPassword(@Body('email') email: string) {
        return this.authService.forgotPassword(email);
    }

    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return await this.authService.resetPassword(resetPasswordDto);
    }

}