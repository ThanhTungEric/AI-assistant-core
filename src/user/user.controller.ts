import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';

import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('findAll')
    async findAll(): Promise<{ message: string; users: { id: number; email: string }[] }> {
        const users = await this.userService.findAll();
        if (users.length === 0) {
            throw new BadRequestException('No users found');
        }
        return {
            message: 'Users retrieved successfully',
            users: users.map(user => ({
                id: user.id,
                email: user.email,
            })),
        };
    }

    @Post('delete')
    async delete(@Body() deleteUserDto: {id: number}): Promise<{ message: string; user: { id: number; email: string } }>  {
        const user = await this.userService.delete(deleteUserDto.id);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        return {
            message: 'User deleted successfully',
            user: {
                id: user.id,
                email: user.email,
            },
        }
    }
}
