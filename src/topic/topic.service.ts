import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from './topic.entity';

@Injectable()
export class TopicService {
    constructor(
        @InjectRepository(Topic)
        private readonly topicRepository: Repository<Topic>,
    ) {}

    createTopic(title: string) {
        const topic = this.topicRepository.create({ title });
        return this.topicRepository.save(topic);
    }

    findAll() {
        return this.topicRepository.find({ relations: ['messages'] });
    }
}
