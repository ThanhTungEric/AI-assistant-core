import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';

import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { SignUpDto } from './dto/signup-user.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}
    // register a new user and hash the password
    async signup(signupDto: SignUpDto): Promise<User> {
        const { email, password } = signupDto;
        const newUser = this.userRepository.create({
            email,
            password,
        });
        return await this.userRepository.save(newUser);
    }

    // login a user and check the password
    async login(loginDto: LoginUserDto) {
        const { email, password } = loginDto;
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new UnauthorizedException('Invalid password');
        }

        return {
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
            },
        };
    }
}
