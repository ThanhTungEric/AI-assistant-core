import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { TopicService } from 'src/topic/topic.service';
import { Topic } from 'src/topic/topic.entity';
import { User } from 'src/user/user.entity';

export interface ChatHistoryItem {
    role: 'user' | 'model';
    parts: { text: string }[];
}

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
        user: Pick<User, 'id'>,
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
            user: { id: user.id } as any,
            topic: finalTopic,
        });

        return this.messageRepository.save(message);
    }

    async findByUser(user: Pick<User, 'id'>) {
        return this.messageRepository.find({
            where: { user: { id: user.id } },
            order: { createdAt: 'DESC' },
        });
    }

    async findMessagesByTopic(
        topicId: number,
        user: Pick<User, 'id'>,
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

    async getRecentMessagesForHistory(
        topicId: number,
        user: { id: number },
        limit = 4,
    ): Promise<ChatHistoryItem[]> {
        const messages = await this.messageRepository.find({
            where: { topic: { id: topicId, user: { id: user.id } } },
            order: { createdAt: 'DESC' },
            take: limit,
        });

        return messages.reverse().map((msg) => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        }));
    }
}
