import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    // add a new user
    async create(user: User): Promise<User> {
        const newUser = this.userRepository.create(user);
        return await this.userRepository.save(newUser);
    }

    // delete a user
    async delete(id: number): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            return null;
        }
        await this.userRepository.delete(id);
        return user;
    }

    async login(email: string, password: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { email } });
            if (!user) {
                return null;
            }
            if (user.password !== password) {
                return null;
            }
        return user;
    }
}
