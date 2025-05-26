import { Body, Controller, Post } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { SignUpDto } from './dto/signup-user.dto';

import { AuthService } from './auth.service';

@Controller('users/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    // register a new user
    async signup(@Body() signupDto: SignUpDto) {
        return this.authService.signup(signupDto);
    }

    @Post('login')
    // login a user
    async login(@Body() loginDto: LoginUserDto) {
        return this.authService.login(loginDto);
    }
}