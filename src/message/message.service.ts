import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { TopicService } from 'src/topic/topic.service';
import { User } from 'src/user/user.entity';
import { Topic } from 'src/topic/topic.entity';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
        private readonly topicService: TopicService,
    ) { }

    async createMessage(
        content: string,
        sender: 'user' | 'ai',
        user: User,
        topic?: Topic,
    ) {
        let finalTopic = topic;
        if (!finalTopic) {
            finalTopic = await this.topicService.createForUser(
                `Conversation started at ${new Date().toLocaleString()}`,
                user,
            );
        }

        const message = this.messageRepository.create({
            content,
            sender,
            user,
            topic: finalTopic,
        });

        return this.messageRepository.save(message);
    }

    async findByUser(user: User) {
        return this.messageRepository.find({
            where: { user: { id: user.id } },
            order: { createdAt: 'DESC' },
        });
    }

    async findMessagesByTopic(
        topicId: number,
        user: User,
        take: number,
        skip: number,
    ): Promise<Message[]> {
        const topic = await this.topicService.findTopicById(topicId, user);

        return this.messageRepository.find({
            where: { topic: { id: topic.id, user: { id: user.id } } },
            order: { createdAt: 'DESC' },
            take,
            skip,
        });
    }
}
