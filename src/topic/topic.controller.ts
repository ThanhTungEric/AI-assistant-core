// src/topic/topic.controller.ts
import { Body, Controller, Get, NotFoundException, Post, Req } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { TopicService } from './topic.service';
import { Request } from 'express';
import { User } from 'src/user/user.entity';
@Controller('topics')
export class TopicController {
    constructor(private readonly topicService: TopicService) { }

    @Post()
    createTopic(@Body() createTopicDto: CreateTopicDto) {
        return this.topicService.createTopic(createTopicDto.title);
    }

    @Get()
    findAll() {
        return this.topicService.findAll();
    }

    @Get('by-user')
    async getTopics(@Req() req: Request) {
        const user = req.session.user as User;
        if (!user) throw new NotFoundException('User not logged in');

        const topics = await this.topicService.findTopicsByUser(user);

        return {
            message: 'Topics retrieved successfully',
            data: topics.map((topic) => ({
                id: topic.id,
                title: topic.title,
                createdAt: topic.createdAt,
            })),
        };
    }
}
