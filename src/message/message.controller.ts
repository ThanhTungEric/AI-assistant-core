import { Body, Controller, Post, Req, Get, NotFoundException, BadRequestException, Param, Query, DefaultValuePipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../user/user.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService } from './message.service';
import { GeminiService } from './gemini.service';
import { plainToInstance } from 'class-transformer';
import { MessageResponseDto } from './dto/message-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('messages')
export class MessageController {
    constructor(
        private readonly messageService: MessageService,
        private readonly geminiService: GeminiService,
    ) { }

    private getUserFromToken(req: Request): User {
        return req.user as User;
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createMessage(@Body() body: CreateMessageDto, @Req() req: Request) {
        const user = this.getUserFromToken(req);
        if (!user) throw new NotFoundException('User not logged in');

        if (body.sender === 'ai') {
            throw new BadRequestException('AI is not allowed to be the sender in this request');
        }

        const userMessage = await this.messageService.createMessage(
            body.content,
            'user',
            user,
            body.topicId ? { id: body.topicId } as any : undefined,
        );

        const aiAnswer = await this.geminiService.getAIResponse(body.content);

        const aiMessage = await this.messageService.createMessage(
            aiAnswer,
            'ai',
            user,
            userMessage.topic,
        );

        return {
            message: 'Messages created successfully',
            data: {
                userMessage: plainToInstance(MessageResponseDto, userMessage),
                aiMessage: plainToInstance(MessageResponseDto, aiMessage),
            },
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findMessages(@Req() req: Request) {
        const user = this.getUserFromToken(req);
        if (!user) throw new NotFoundException('User not logged in');

        const messages = await this.messageService.findByUser(user);

        return {
            message: 'Messages retrieved successfully',
            data: messages.map((msg) => plainToInstance(MessageResponseDto, msg)),
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get('topic/:topicId')
    async getMessagesByTopic(
        @Req() req: Request,
        @Param('topicId') topicId: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    ) {
        const user = this.getUserFromToken(req);
        if (!user) throw new NotFoundException('User not logged in');

        const skip = (page - 1) * limit;

        const messages = await this.messageService.findMessagesByTopic(
            Number(topicId),
            user,
            limit,
            skip,
        );

        return {
            message: 'Messages retrieved by topic',
            data: messages.map((msg) => plainToInstance(MessageResponseDto, msg)),
        };
    }
}
