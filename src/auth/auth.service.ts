import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { LoginUserDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async validateUser(login: string, password: string): Promise<User> {
        const isEmail = login.includes('@');
        const user = await this.userRepository.findOne({
            where: isEmail ? { email: login } : { username: login },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }

    async signup(signupDto: SignUpDto): Promise<{ message: string; user: { id: number; email: string; username: string } }> {
        const { email, password, username } = signupDto;
        const newUser = this.userRepository.create({
            email,
            password,
            username,
        });
        await this.userRepository.save(newUser);

        return {
            message: 'User registered successfully',
            user: {
                username: newUser.username,
                id: newUser.id,
                email: newUser.email,
            },
        };
    }

    async login(req: Request, loginDto: LoginUserDto): Promise<{ message: string; session: any }> {
        const { login, password } = loginDto;
        const user = await this.validateUser(login, password);

        req.session.user = {
            id: user.id,
            email: user.email,
            username: user.username,
        };
        req.session.save(() => { });

        return {
            message: 'Login successful',
            session: req.session,
        };
    }

    async logout(request: Request): Promise<{ message: string }> {
        return new Promise((resolve, reject) => {
            request.session.destroy((err) => {
                if (err) {
                    reject(new UnauthorizedException('Logout failed'));
                } else {
                    resolve({ message: 'Logout successful' });
                }
            });
        });
    }

    getProfile(req: Request): { user: { id: number; email: string; username: string } } {
        const user = req.session.user;
        if (!user) {
            throw new UnauthorizedException('User not authenticated');
        }
        req.session.touch();
        return { user: { id: user.id, email: user.email, username: user.username } };
    }

    async forgotPassword(email: string): Promise<{ message: string }> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return { message: 'Temporary password sent to email' };
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
        const { email, temporaryPassword, newPassword } = resetPasswordDto;
        const user = await this.userRepository.findOne({ where: { email } });

        if (!user || user.temporaryPassword !== temporaryPassword) {
            throw new UnauthorizedException('Invalid credentials or temporary password');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await this.userRepository.update(user.id, {
            password: hashedPassword,
            temporaryPassword: undefined,
        });

        return { message: 'Password reset successfully' };
    }
}
