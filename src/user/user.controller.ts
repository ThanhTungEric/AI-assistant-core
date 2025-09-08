import { BadRequestException, Controller, Delete, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    async findAll(): Promise<{ message: string; users: { id: number; email: string; username: string }[] }> {
        const users = await this.userService.findAll();
        if (users.length === 0) {
            throw new BadRequestException('No users found');
        }
        return {
            message: 'Users retrieved successfully',
            users: users.map(user => ({
                id: user.id,
                email: user.email,
                username: user.username,
            })),
        };
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<{ message: string; user: { id: number; email: string; username: string } }> {
        const numericId = parseInt(id, 10);
        const user = await this.userService.findById(numericId);
        return {
            message: `User with ID ${user.id} retrieved successfully`,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
            },
        };
    }

    @Get('username/:username')
    async findByUserName(@Param('username') username: string): Promise<{ message: string; user: { id: number; email: string; username: string } }> {
        const user = await this.userService.findByUsername(username);
        return {
            message: `User with username ${user.username} retrieved successfully`,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
            },
        };
    }

    @Get('email/:email')
    async findByEmail(@Param('email') email: string): Promise<{ message: string; user: { id: number; email: string; username: string } }> {
        const user = await this.userService.findByEmail(email);
        return {
            message: `User with email ${user.email} retrieved successfully`,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
            },
        };
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<{ message: string; user: { id: number; email: string; username: string } }> {
        const numericId = parseInt(id, 10);
        const user = await this.userService.delete(numericId);
        return {
            message: 'User deleted successfully',
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
            },
        };
    }
}