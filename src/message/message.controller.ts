import { Body, Controller, Get, NotFoundException, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService } from './message.service';

@Controller('messages')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    async createMessage(@Body() body: CreateMessageDto) {
        const { topicId, content, sender } = body;

        const message = await this.messageService.createMessage(topicId, content, sender);
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
            }
        }
    }

    
    @Get()
    async findMessagesByTopic(@Query('topicId') topicId: number, content: string, sender: 'user'|'ai') {
        const messages = topicId
        ? await this.messageService.findByTopic(topicId)
        : await this.messageService.findAll(topicId, content, sender);

        if (!messages || messages.length === 0) {
            throw new NotFoundException('No messages found for the given criteria');
    }
        return {
            message: 'Messages retrieved successfully',
            data: messages,
        };
    }
}
