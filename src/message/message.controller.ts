import {
    Body,
    Controller,
    Post,
    Req,
    Get,
    BadRequestException,
    Param,
    Query,
    DefaultValuePipe,
    ParseIntPipe,
    UseGuards,
    InternalServerErrorException,
} from "@nestjs/common";
import { Request } from "express";
import { CreateMessageDto } from "./dto/create-message.dto";
import { MessageService, ChatHistoryItem } from "./message.service";
import { GeminiService } from "./gemini.service";
import { plainToInstance } from "class-transformer";
import { MessageResponseDto } from "./dto/message-response.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { getSafeUser } from "src/common/utils/get-safe-user.util";
import { TopicService } from "src/topic/topic.service";

@Controller("messages")
export class MessageController {
    constructor(
        private readonly messageService: MessageService,
        private readonly geminiService: GeminiService,
        private readonly topicService: TopicService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createMessage(@Body() body: CreateMessageDto, @Req() req: Request) {
        const user = getSafeUser(req);

        try {
            if (body.sender === "ai") {
                throw new BadRequestException("AI is not allowed to be the sender in this request");
            }

            const topic = body.topicId && body.topicId > 0 ? ({ id: body.topicId } as any) : undefined;

            const userMessage = await this.messageService.createMessage(body.content, "user", user, topic);

            let history: ChatHistoryItem[] = [];
            if (userMessage.topic?.id) {
                history = await this.messageService.getRecentMessagesForHistory(userMessage.topic.id, user, 4);

                const currentTopic = await this.topicService.findTopicById(userMessage.topic.id, user);

                if (currentTopic.renameCount === 0) {
                    const topicName = await this.geminiService.getTopicName([{ role: 'user', parts: [{ text: body.content }] }]);
                    await this.topicService.updateTitleAndCount(currentTopic.id, topicName);
                } else if (currentTopic.renameCount === 1 && history.length >= 2) {
                    const topicName = await this.geminiService.getTopicName(history);
                    await this.topicService.updateTitleAndCount(currentTopic.id, topicName);
                }
            }

            const aiAnswer = await this.geminiService.getAIResponse(body.content, history);

            const aiMessage = await this.messageService.createMessage(aiAnswer, "ai", user, userMessage.topic);

            return {
                message: 'Messages created successfully',
                data: {
                    userMessage: plainToInstance(MessageResponseDto, {
                        ...userMessage,
                        topicId: userMessage.topic?.id,
                    }),
                    aiMessage: plainToInstance(MessageResponseDto, {
                        ...aiMessage,
                        topicId: aiMessage.topic?.id,
                    }),
                },
            };
        } catch (error) {
            throw new InternalServerErrorException('Error creating message');
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findMessages(@Req() req: Request) {
        const user = getSafeUser(req);

        const messages = await this.messageService.findByUser(user);

        return {
            message: "Messages retrieved successfully",
            data: messages.map((msg) => plainToInstance(MessageResponseDto, msg)),
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get("topic/:topicId")
    async getMessagesByTopic(
        @Req() req: Request,
        @Param("topicId") topicId: string,
        @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit: number
    ) {
        const user = getSafeUser(req);

        const skip = (page - 1) * limit;

        const messages = await this.messageService.findMessagesByTopic(
            Number(topicId),
            user,
            limit,
            skip
        );

        return {
            message: "Messages retrieved by topic",
            data: messages.map((msg) => plainToInstance(MessageResponseDto, msg)),
        };
    }
}
