import { Expose } from 'class-transformer';

export class TopicResponseDto {
    @Expose()
    id: number;

    @Expose()
    title: string;

    @Expose()
    createdAt: Date;
}