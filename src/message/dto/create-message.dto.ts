import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
    @IsNumber()
    topicId: number;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsString()
    @IsIn(['user', 'ai'], { message: 'Sender must be either "user" or "ai"' })
    sender: 'user' | 'ai';
}
