import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { SignUpDto } from './dto/signup-user.dto';
import { LocalGuard } from './guards/local.guard';


@Controller('users/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
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
    logout(@Req() req: Request): Promise<{ message: string }> {
        return this.authService.logout(req);
    }

    @Get('profile')
    // get the profile of the logged-in user
    getProfile(@Req() req: Request): { session: any } {
        const user = req.session.user;
        if (!user || !req.session) {
            throw new UnauthorizedException('User not authenticated');
        }
        return { session: req.session };
    }
}