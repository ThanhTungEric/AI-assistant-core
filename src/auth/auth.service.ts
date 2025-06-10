import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';

import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { SignUpDto } from './dto/signup-user.dto';

import { EmailService } from 'src/email/email.service';
import { ResetPasswordDto } from './dto/reset-password.dto';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly emailService: EmailService,
    ) {}
    
    // validate user credentials
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
    
    // register a new user and hash the password
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

    // login a user and check the password
    async login(req: Request, loginDto: LoginUserDto): Promise<{ message: string; session: any }> {
        const { login, password } = loginDto;

        const user = await this.validateUser(login, password);

        req.session.user = {
            id: user.id,
            email: user.email,
            username: user.username,
        };

        req.session.save(() => {}); // optionally handle error here

        return {
            message: 'Login successful',
            session: req.session,
            };
        }


    logout(req: Request, res: Response) {
        req.session.destroy((err) => {
            if (err) {
                res.status(401).json({ message: 'Logout failed' });
            } else {
                console.log('Logout successful');
                res.clearCookie('connect.sid');
                res.status(200).json({
                    message: 'Logout successful',
                    session: null,
                });
            }
        });
    }

    getProfile(req: Request): { user: { id: number; email: string; username: string } } {
        const user = req.session.user;
        if (!user) {
            throw new UnauthorizedException('User not authenticated');
        }
        return { user: { id: user.id, email: user.email, username: user.username } };
    }

    async forgotPassword(email: string): Promise<void> {
        const user = await this.userRepository.findOne({ where: { email } });

        if (!user) {
            throw new NotFoundException(`No user found for email: ${email}`);
        }
        await this.emailService.sendResetPassword(email);
    }

    public async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{message: string}> {
        const { email, temporaryPassword, newPassword } = resetPasswordDto;
        const user = await this.userRepository.findOne({ where: { email } });

        if (!user || !user.isTemporaryPassword || !user.resetTokenExpiresAt) {
            throw new BadRequestException('Reset not allowed');
        }

        if (user.resetTokenExpiresAt.getTime() < Date.now()) {
            throw new BadRequestException('Temporary password expired');
        }

        const isValidTempPassword = await bcrypt.compare(temporaryPassword, user.tempPassword);

        if (!isValidTempPassword) {
            throw new BadRequestException('Temporary password is invalid');
        }

        // Set new password
        user.password = await bcrypt.hash(newPassword, 10);
        user.isTemporaryPassword = false;

        await this.userRepository.save(user);

        return {
            message : "Password reset successfully"
        }
    }
}

