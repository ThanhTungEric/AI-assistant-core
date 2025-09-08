import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUpDto {
    @IsNotEmpty()
    @IsEmail({}, { message: 'Please enter correct email' })
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(3, { message: 'User must be at least 3 characters long' })
    username: string;
}