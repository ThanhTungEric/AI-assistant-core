import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from 'src/topic/topic.entity';
import { TopicModule } from 'src/topic/topic.module';
import { MessageController } from './message.controller';
import { Message } from './message.entity';
import { MessageService } from './message.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Message, Topic]),
        TopicModule,
    ],
    controllers: [MessageController],
    providers: [MessageService],
})
export class MessageModule {}