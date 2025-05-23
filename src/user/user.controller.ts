import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';

import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('add')
    // add a new user
    async create(@Body() createUserDto: any) {
        const user = await this.userService.create(createUserDto);
        return { message: 'User created successfully', user };
    }

    @Post('delete')
    // delete a user
    async delete(@Body() deleteUserDto: { id: number }) {
        const user = await this.userService.delete(deleteUserDto.id);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        return { message: 'User deleted successfully', user };
    }


    @Post('login')
    // login for a user
    async login(@Body() loginUserDto: LoginUserDto) {
        const user = await this.userService.login(loginUserDto.email, loginUserDto.password);
        if (!user) {
        throw new BadRequestException('Invalid email or password');
        }
        return { message: 'Login successful', user };
    }
}
