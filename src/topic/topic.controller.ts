// src/topic/topic.controller.ts
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { TopicService } from './topic.service';

@Controller('topics')
export class TopicController {
    constructor(private readonly topicService: TopicService) {}

    @Post()
    createTopic(@Body() createTopicDto: CreateTopicDto) {
        return this.topicService.createTopic(createTopicDto.title);
    }

    @Get()
    findAll() {
        return this.topicService.findAll();
    }
}
