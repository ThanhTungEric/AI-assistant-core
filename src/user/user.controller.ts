import { BadRequestException, Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    async findAll(): Promise<{ message: string; users: { id: number; email: string; fullName: string }[] }> {
        const users = await this.userService.findAll();
        if (users.length === 0) {
            throw new BadRequestException('No users found');
        }
        return {
            message: 'Users retrieved successfully',
            users: users.map(user => ({
                id: user.id,
                email: user.email,
                fullName: user.fullName,
            })),
        };
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<{ message: string; user: { id: number; email: string; fullName: string } }> {
        const numericId = parseInt(id, 10);
        const user = await this.userService.findById(numericId);
        return {
            message: `User with ID ${user.id} retrieved successfully`,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
            },
        };
    }


    @Get('email/:email')
    async findByEmail(@Param('email') email: string): Promise<{ message: string; user: { id: number; email: string; fullName: string } }> {
        const user = await this.userService.findByEmail(email);
        return {
            message: `User with email ${user.email} retrieved successfully`,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
            },
        };
    }

    @Patch(':id/fullName')
    async updateFullName(
        @Param('id') id: string,
        @Body('fullName') fullName: string,
    ): Promise<{ message: string; user: { id: number; email: string; fullName: string } }> {
        if (!fullName || fullName.trim().length === 0) {
            throw new BadRequestException('Full name cannot be empty');
        }

        const numericId = parseInt(id, 10);
        const user = await this.userService.updateFullName(numericId, fullName);

        return {
            message: 'User full name updated successfully',
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
            },
        };
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<{ message: string; user: { id: number; email: string; fullName: string } }> {
        const numericId = parseInt(id, 10);
        const user = await this.userService.delete(numericId);
        return {
            message: 'User deleted successfully',
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
            },
        };
    }
}
