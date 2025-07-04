import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicController } from './topic.controller';
import { Topic } from './topic.entity';
import { TopicService } from './topic.service';

@Module({
    imports: [TypeOrmModule.forFeature([Topic])],
    controllers: [TopicController],
    providers: [TopicService],
    exports: [TypeOrmModule]
})
export class TopicModule {}