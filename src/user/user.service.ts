import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } });
    }


    async findById(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new BadRequestException('User not found');
        return user;
    }

    async create(userData: Partial<User>): Promise<User> {
        return this.userRepository.create(userData);
    }

    async save(user: User): Promise<User> {
        return this.userRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async updateFullName(id: number, fullName: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new BadRequestException('User not found');
        user.fullName = fullName;
        await this.userRepository.save(user);
        return user;
    }

    async delete(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) throw new BadRequestException('User not found');
        await this.userRepository.remove(user);
        return user;
    }
}
