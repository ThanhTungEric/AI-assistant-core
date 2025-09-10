import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

import { Message } from "src/message/message.entity";
import { Topic } from "src/topic/topic.entity";

@Entity("user")
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    fullName: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: true, type: 'varchar', length: 255 })
    temporaryPassword?: string;

    @OneToMany(() => Message, (message) => message.user)
    messages: Message[];

    @OneToMany(() => Topic, (topic) => topic.user)
    topics: Topic[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
