// src/message/message.service.ts
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
        @InjectRepository(Topic) private topicRepository: Repository<Topic>

    ) { }

    async createMessage(
        content: string,
        sender: 'user' | 'ai',
        user: User,
        topic?: Topic, // <-- tham số thứ 4
    ) {
        let finalTopic = topic;
        if (!finalTopic) {
            // Tạo topic mới nếu chưa có
            finalTopic = this.topicRepository.create({
                title: `Conversation started at ${new Date().toLocaleString()}`,
                user: user,
            });
            finalTopic = await this.topicRepository.save(finalTopic);
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
            order: { createdAt: 'ASC' },
        });
    }

    async findTopicsWithMessages(user: User) {
        return this.topicRepository.find({
            where: { user: { id: user.id } },
            order: { createdAt: 'ASC' },
            relations: ['messages'],
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

    async findOrCreateTopic(topicId: number | undefined, user: User): Promise<Topic> {
        let topic: Topic | undefined;

        if (topicId) {
            topic = await this.findTopicById(topicId, user);
        }

        if (!topic) {
            topic = this.topicRepository.create({
                title: `Conversation started at ${new Date().toLocaleString()}`,
                user: user,
            });
            topic = await this.topicRepository.save(topic);
        }

        return topic;
    }

    async findMessagesByTopic(topicId: number, user: User): Promise<Message[]> {
        const topic = await this.topicRepository.findOne({
            where: { id: topicId, user: { id: user.id } },
        });

        if (!topic) {
            throw new NotFoundException('Topic not found or does not belong to user');
        }

        return this.messageRepository.find({
            where: { topic: { id: topicId }, user: { id: user.id } },
            order: { createdAt: 'ASC' },
        });
    }

}

