import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from './topic.entity';

@Injectable()
export class TopicService {
    constructor(
        @InjectRepository(Topic)
        private readonly topicRepository: Repository<Topic>,
    ) { }

    async createForUser(title: string, user: { id: number }): Promise<Topic> {
        const topic = this.topicRepository.create({
            title,
            user: { id: user.id } as any,
        });
        return this.topicRepository.save(topic);
    }

    async findAllByUser(user: { id: number }): Promise<Partial<Topic>[]> {
        return this.topicRepository.find({
            where: { user: { id: user.id } },
            order: { createdAt: 'DESC' },
            select: ['id', 'title', 'createdAt'],
        });
    }

    async findTopicById(topicId: number, user: { id: number }): Promise<Topic> {
        const topic = await this.topicRepository.findOne({
            where: { id: topicId, user: { id: user.id } },
        });

        if (!topic) {
            throw new NotFoundException('Topic not found or does not belong to user');
        }

        return topic;
    }

    async findWithMessages(user: { id: number }): Promise<Topic[]> {
        return this.topicRepository.find({
            where: { user: { id: user.id } },
            relations: ['messages'],
            order: { createdAt: 'DESC' },
        });
    }


    async updateTitleAndCount(topicId: number, title: string): Promise<void> {
        await this.topicRepository.query(
            `UPDATE \`topic\` SET \`title\` = ?, \`renameCount\` = \`renameCount\` + 1 WHERE \`id\` = ?`,
            [title, topicId]
        );
    }
}
