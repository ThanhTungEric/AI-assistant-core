import { Body, Controller, Get, NotFoundException, Post, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Request } from 'express';
import { SessionGuard } from 'src/auth/guards/session.guard';
import { User } from '../user/user.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import { MessageService } from './message.service';

@ApiResponse({
    status: 201,
    description: 'Message created successfully',
    type: MessageResponseDto,
})

@Controller('users')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @UseGuards(SessionGuard)
    @Post('message')
    async createMessage(@Body() body: CreateMessageDto, @Req() req: Request) {
        const user = req.session.user;
        if (!user || !req.session) {
            throw new UnauthorizedException('User has not logged in yet!');
        }

        if (body.sender == 'ai') {
            throw new NotFoundException('AI is not allowed to be the sender in this situation')
        }

        const message = await this.messageService.createMessage(body.topicId, body.content, body.sender, user as User);
        
        const responseDto = plainToInstance(MessageResponseDto, {
                id: message.id,
                content: message.content,
                sender: message.sender,
                topicId: message.topic.id,
                topicTitle: message.topic.title,
                createdAt: message.createdAt,
        });

        return {
            message: 'Message created successfully',
            data: responseDto,
            user: user.username,
        };
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
