import { Body, Controller, Post, Req, Get, Param, UseGuards, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateTopicDto } from './dto/create-topic.dto';
import { TopicService } from './topic.service';
import { Request } from 'express';
import { getSafeUser } from 'src/common/utils/get-safe-user.util';
@Controller('topics')
export class TopicController {
    constructor(private readonly topicService: TopicService) { }


    @UseGuards(JwtAuthGuard)
    @Post()
    async createTopic(@Body() createTopicDto: CreateTopicDto, @Req() req: Request) {
        const user = getSafeUser(req);
        return this.topicService.createForUser(createTopicDto.title, user);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@Req() req: Request) {
        const user = getSafeUser(req);
        return this.topicService.findAllByUser(user);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/messages')
    async getMessagesOfTopic(@Param('id') id: string, @Req() req: Request) {
        const user = getSafeUser(req);
        return this.topicService.findWithMessages(user);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getTopicById(@Param('id') id: string, @Req() req: Request) {
        const user = getSafeUser(req);
        const topicId = parseInt(id, 10);
        return this.topicService.findTopicById(topicId, user);
    }
}
