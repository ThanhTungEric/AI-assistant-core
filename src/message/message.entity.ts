import { Topic } from 'src/topic/topic.entity';
import { User } from 'src/user/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    sender: 'user' | 'ai'

    @Column()
    content: string;

    @ManyToOne(() => Topic, (topic) => topic.messages, {eager: true})
    topic: Topic;

    @ManyToOne(() => User, user => user.messages)
    user: User;

    @CreateDateColumn()
    createdAt: Date;
}