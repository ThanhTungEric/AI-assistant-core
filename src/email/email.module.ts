import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        ConfigModule,
        JwtModule,
    ],
    controllers: [EmailController],
    providers: [EmailService],
    exports: [EmailService]
})
export class EmailModule {}