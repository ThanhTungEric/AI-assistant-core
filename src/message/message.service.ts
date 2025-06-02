import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Topic } from 'src/topic/topic.entity';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message) private messageRepository: Repository<Message>,
        @InjectRepository(Topic) private topicRepository: Repository<Topic>,
    ) {}

    async createMessage(topicId: number, content: string, sender: 'user' | 'ai', user: User) {
        const topic = await this.topicRepository.findOneBy({ id: topicId });
        if (!topic) throw new NotFoundException('Topic not found');

        const message = this.messageRepository.create({ topic, content, sender, user });
        return this.messageRepository.save(message);
    }

    findByTopic(topicId: number, user: User) {
        return this.messageRepository.find({
            where: { topic: { id: topicId }, user: { id: user.id } },
            order: { createdAt: 'ASC' }
        });
    }

    async findAll(topicId: number, content: string, sender: 'user'|'ai', user: User) {
        return this.messageRepository.find({
            where: {
                topic: { id: topicId },
                user: { id: user.id },
                content,
                sender,
            },
        });
    }
}
