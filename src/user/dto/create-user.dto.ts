import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(10, { message: 'Password must be at least 10 characters long' })
    password: string;

    @IsNotEmpty()
    @MinLength(3, { message: 'Username must be at least 3 characters long' })
    username: string;
}