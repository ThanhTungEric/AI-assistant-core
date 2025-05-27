import { Body, Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';

import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { SignUpDto } from './dto/signup-user.dto';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}
    
    // validate user credentials
    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new UnauthorizedException('Invalid email or password');
        }
        return user;
    }
    // register a new user and hash the password
    async signup(@Body() signupDto: SignUpDto): Promise<{ message: string; user: { id: number; email: string } }> {
        const { email, password } = signupDto;
        const newUser = this.userRepository.create({
            email,
            password,
        });
        await this.userRepository.save(newUser);

        return {
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                email: newUser.email,
            },
        };
    }

    // login a user and check the password
    async login(@Req() req: Request, @Body() loginDto: LoginUserDto): Promise<{ message: string, session: any }> {
        const { email, password } = loginDto;
        // find if the user exists by email
        const user = await this.validateUser(email, password);

        if (!user) {
            throw new UnauthorizedException("Invalid email or password");
        }

        // store user information in the session
        req.session.user = {
            id: user.id,
            email: user.email,
        };

        return {
            message: 'Login successful',
            session: req.session,
        }
    }

    async logout(@Req() request: Request): Promise<{ message: string, session: any }> {
        return new Promise((resolve, reject) => {
            request.session.destroy((err) => {
                if (err) {
                    reject(new UnauthorizedException('Logout failed'));
                } else {
                    resolve({
                        message: 'Logout successful',
                        session: request.session,
                    });
                }
            });
        });
    }

    getProfile(@Req() req: Request): { user: { id: number; email: string } } {
        const user = req.session.user;
        if (!user) {
            throw new UnauthorizedException('User not authenticated');
        }
        return { user: { id: user.id, email: user.email } };
    }
}

