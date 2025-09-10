import { IsString, IsEmail, MinLength } from 'class-validator';

export class SignUpDto {
    @IsEmail()  // Kiểm tra định dạng email
    email: string;

    @IsString()
    @MinLength(6)  // Đảm bảo mật khẩu có ít nhất 6 ký tự
    password: string;

    @IsString()
    fullName: string;
}
