import { Body, Controller, Post, Req, Get, NotFoundException, BadRequestException, Param } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../user/user.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService } from './message.service';
import { GeminiService } from './gemini.service';
import { plainToInstance } from 'class-transformer';
import { MessageResponseDto } from './dto/message-response.dto';
import { Topic } from 'src/topic/topic.entity';
import { Repository } from 'typeorm';

@Controller('users/message')
export class MessageController {
    constructor(
        private readonly messageService: MessageService,
        private readonly geminiService: GeminiService,
    ) { }

    // src/message/message.controller.ts
    @Post()
    async createMessage(@Body() body: CreateMessageDto, @Req() req: Request) {
        const user = req.session.user as User;
        if (!user) throw new NotFoundException('User not logged in');

        if (body.sender === 'ai') {
            throw new BadRequestException('AI is not allowed to be the sender in this request');
        }

        // Gọi Service để lấy hoặc tạo topic
        const topic = await this.messageService.findOrCreateTopic(body.topicId, user);

        // Tạo tin nhắn User
        const userMessage = await this.messageService.createMessage(
            body.content,
            'user',
            user,
            topic,
        );

        // Gọi AI trả lời
        const aiAnswer = await this.geminiService.getAIResponse(body.content);

        // Tạo tin nhắn AI
        const aiMessage = await this.messageService.createMessage(
            aiAnswer,
            'ai',
            user,
            topic,
        );

        return {
            message: 'Messages created successfully',
            data: {
                userMessage: {
                    id: userMessage.id,
                    content: userMessage.content,
                    sender: userMessage.sender,
                    topicId: topic.id,
                    topicTitle: topic.title,
                    createdAt: userMessage.createdAt,
                },
                aiMessage: {
                    id: aiMessage.id,
                    content: aiMessage.content,
                    sender: aiMessage.sender,
                    topicId: topic.id,
                    topicTitle: topic.title,
                    createdAt: aiMessage.createdAt,
                },
            },
            user: user.username,
        };
    }



    @Get()
    async findMessages(@Req() req: Request) {
        const user = req.session.user as User;
        if (!user) throw new NotFoundException('User not logged in');

        const messages = await this.messageService.findByUser(user);

        return {
            message: 'Messages retrieved successfully',
            data: messages.map((msg) =>
                plainToInstance(MessageResponseDto, {
                    id: msg.id,
                    content: msg.content,
                    sender: msg.sender,
                    topicId: null,
                    topicTitle: null,
                    createdAt: msg.createdAt,
                })
            ),
            user: user.username,
        };
    }
    @Get('topics')
    async getTopicsWithMessages(@Req() req: Request) {
        const user = req.session.user as User;
        if (!user) throw new NotFoundException('User not logged in');

        const topics = await this.messageService.findTopicsWithMessages(user);

        return {
            message: 'Topics with messages retrieved successfully',
            data: topics.map((topic) => ({
                id: topic.id,
                title: topic.title,
                createdAt: topic.createdAt,
                messages: topic.messages
                    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
                    .map((msg) => ({
                        id: msg.id,
                        content: msg.content,
                        sender: msg.sender,
                        createdAt: msg.createdAt,
                    })),
            })),
        };
    }


    @Get('topics/:topicId/messages')
    async getMessagesByTopic(
        @Req() req: Request,
        @Param('topicId') topicId: string,
    ) {
        const user = req.session.user as User;
        if (!user) throw new NotFoundException('User not logged in');

        const messages = await this.messageService.findMessagesByTopic(Number(topicId), user);

        return {
            message: 'Messages retrieved by topic',
            data: messages.map(msg => ({
                id: msg.id,
                content: msg.content,
                sender: msg.sender,
                createdAt: msg.createdAt,
            })),
        };
    }

}
