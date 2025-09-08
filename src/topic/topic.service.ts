import { Injectable } from '@nestjs/common';
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

    createTopic(title: string) {
        const topic = this.topicRepository.create({ title });
        return this.topicRepository.save(topic);
    }

    findAll() {
        return this.topicRepository.find({
            relations: ['messages'],
            order: {
                createdAt: 'DESC',
            },
        });
    }


    async findTopicsByUser(user: User) {
        return this.topicRepository.find({
            where: { user: { id: user.id } },
            order: { createdAt: 'DESC' },
        });
    }
}
