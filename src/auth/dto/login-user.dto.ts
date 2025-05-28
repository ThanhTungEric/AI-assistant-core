// src/user/dto/login-user.dto.ts
import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
    @IsNotEmpty({ message: 'Email or username is required' })
    login: string;

    @IsNotEmpty({ message: 'Password is required' })
    password: string;
}
