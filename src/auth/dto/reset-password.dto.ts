import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
    @IsEmail({}, { message: 'Email must be a valid email address.' })
    @IsNotEmpty({ message: 'Email cannot be empty.' })
    email: string;

    @IsString({ message: 'Temporary password must be a string.' })
    @IsNotEmpty({ message: 'Temporary password cannot be empty.' })
    @MinLength(6, { message: 'Temporary password must be at least 6 characters long.' })
    temporaryPassword: string;

    @IsString({ message: 'New password must be a string.' })
    @IsNotEmpty({ message: 'New password cannot be empty.' })
    @MinLength(6, { message: 'New password must be at least 6 characters long.' })
    newPassword: string;
}
