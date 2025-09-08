import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from 'src/topic/topic.entity';
import { TopicModule } from 'src/topic/topic.module';
import { MessageController } from './message.controller';
import { Message } from './message.entity';
import { MessageService } from './message.service';
import { GeminiService } from './gemini.service'; // Adjusted import path for GeminiService

@Module({
    imports: [
        TypeOrmModule.forFeature([Message, Topic]),
        TopicModule,
    ],
    controllers: [MessageController],
    providers: [MessageService, GeminiService],
})
export class MessageModule {}