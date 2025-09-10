// src/topic/topic.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from './topic.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class TopicService {
    constructor(
        @InjectRepository(Topic)
        private readonly topicRepository: Repository<Topic>,
    ) { }

    async createForUser(title: string, user: User): Promise<Topic> {
        const topic = this.topicRepository.create({ title, user });
        return this.topicRepository.save(topic);
    }

    async findAllByUser(user: User): Promise<Partial<Topic>[]> {
        return this.topicRepository.find({
            where: { user: { id: user.id } },
            order: { createdAt: 'DESC' },
            select: ['id', 'title', 'createdAt'],
        });
    }

    async findTopicById(topicId: number, user: User): Promise<Topic> {
        const topic = await this.topicRepository.findOne({
            where: { id: topicId, user: { id: user.id } },
        });

        if (!topic) {
            throw new NotFoundException('Topic not found or does not belong to user');
        }

        return topic;
    }

    async findWithMessages(user: User): Promise<Topic[]> {
        return this.topicRepository.find({
            where: { user: { id: user.id } },
            relations: ['messages'],
            order: { createdAt: 'DESC' },
        });
    }
}
