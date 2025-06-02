import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Topic } from 'src/topic/topic.entity';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message) private messageRepository: Repository<Message>,
        @InjectRepository(Topic) private topicRepository: Repository<Topic>,
    ) {}

    async createMessage(topicId: number, content: string, sender: 'user' | 'ai') {
        const topic = await this.topicRepository.findOneBy({ id: topicId });
        if (!topic) throw new NotFoundException('Topic not found');

        const message = this.messageRepository.create({ topic, content, sender });
        return this.messageRepository.save(message);
    }

    findByTopic(topicId: number) {
        return this.messageRepository.find({
            where: { topic: { id: topicId } },
            order: { createdAt: 'ASC' },
        });
    }

    async findAll(topicId: number, content: string, sender: 'user'|'ai') {
        return this.messageRepository.find({
            where: {
                topic: { id: topicId },
                content,
                sender,
            },
        });
    }
}
