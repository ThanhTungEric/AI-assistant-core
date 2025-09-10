import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    content: string;

    @ApiProperty()
    sender: string;

    @ApiProperty()
    topicId: number;

    @ApiProperty()
    createdAt: Date;
}
