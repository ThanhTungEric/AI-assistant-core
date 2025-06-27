import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { typeOrmConfig } from '../config/typeorm.config';
import { EmailModule } from '../email/email.module';
import { MessageModule } from '../message/message.module';
import { TopicModule } from '../topic/topic.module';
import { UserModule } from '../user/user.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UserModule,
    AuthModule,
    TopicModule,
    MessageModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
