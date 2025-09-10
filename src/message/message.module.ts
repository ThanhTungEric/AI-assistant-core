import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from 'src/topic/topic.entity';
import { TopicModule } from 'src/topic/topic.module';
import { MessageController } from './message.controller';
import { Message } from './message.entity';
import { MessageService } from './message.service';
import { GeminiService } from './gemini.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Message, Topic]),
        TopicModule,
        JwtModule,
        AuthModule,
    ],
    controllers: [MessageController],
    providers: [MessageService, GeminiService],
})
export class MessageModule { }
