import { Body, Controller, Get, NotFoundException, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../user/user.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService } from './message.service';

@Controller('users/message')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @Post()
    async createMessage(@Body() body: CreateMessageDto, @Req() req: Request) {
        const user = req.session.user as User;
        if (!user) {
            throw new NotFoundException('User have not logged in yet!');
        }

        if (body.sender == 'ai') {
            throw new NotFoundException('AI is not allowed to be the sender in this situation')
        }

        const message = await this.messageService.createMessage(body.topicId, body.content, body.sender, user);
        return {
            message: 'Message created successfully',
            data: {
                id: message.id,
                content: message.content,
                sender: message.sender,
                topic: {
                    id: message.topic.id,
                    title: message.topic.title,
                    },
                createdAt: message.createdAt,
            },
            user: user.username,
        }
    }

    
    @Get()
    async findMessagesByTopic(@Query('topicId') topicId: number, content: string, sender: 'user'|'ai', @Req() req: Request) {
        const user = req.session.user as User;
        const messages = topicId
        ? await this.messageService.findByTopic(topicId, user)
        : await this.messageService.findAll(topicId, content, sender, user);
        

        if (!messages || messages.length === 0) {
            throw new NotFoundException('No messages found for the given criteria');
    }
        return {
            message: 'Messages retrieved successfully',
            data: messages,
            user: user.username
        };
    }
}
