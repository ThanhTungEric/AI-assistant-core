import { Message } from 'src/message/message.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Topic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => User, (user) => user.topics)
  user: User;

  @OneToMany(() => Message, (message: Message) => message.topic)
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: 0 })
  renameCount: number;
}
