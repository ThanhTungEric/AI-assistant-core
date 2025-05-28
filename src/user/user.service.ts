import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    // create a new user
    async createUser(createUserDto: CreateUserDto) {
        const newUser = this.userRepository.create(createUserDto);
        await this.userRepository.save(newUser);
        return newUser;
    }

    // delete a user by id
    async delete(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new BadRequestException('User not found');
        }
        await this.userRepository.remove(user);
        return user;
    }

    // find all users
    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    // find a user by id
    async findById(id: number): Promise<{ id: number; email: string }> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new BadRequestException('User not found');
        }
        return user;
    }

    // find a user by username
    async findByUsername(username: string): Promise<{ username: string; email: string}> {
        const user = await this.userRepository.findOne({ where: {username} });
        if (!user) {
            throw new BadRequestException('User not found');
        }
        return user;
    }

    // find a user by email
    async findByEmail(email: string): Promise<{ id: number; email: string}> {
        const user = await this.userRepository.findOne({ where: {email} });
        if (!user) {
            throw new BadRequestException('User not found');
        }
        return user;
    }
}