import { Body, Controller, Post, Req, Get, Param, UseGuards, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateTopicDto } from './dto/create-topic.dto';
import { TopicService } from './topic.service';
import { Request } from 'express';
import { User } from 'src/user/user.entity';

@Controller('topics')
export class TopicController {
    constructor(private readonly topicService: TopicService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createTopic(@Body() createTopicDto: CreateTopicDto, @Req() req: Request) {
        const user = req.user as User;
        if (!user) throw new NotFoundException('User not logged in');
        return this.topicService.createForUser(createTopicDto.title, user);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@Req() req: Request) {
        const user = req.user as User;
        if (!user) throw new NotFoundException('User not logged in');
        return this.topicService.findAllByUser(user);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/messages')
    async getMessagesOfTopic(@Param('id') id: string, @Req() req: Request) {
        const user = req.user as User;
        if (!user) throw new NotFoundException('User not logged in');
        return this.topicService.findWithMessages(user);
    }
}
