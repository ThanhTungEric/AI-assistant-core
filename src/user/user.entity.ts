import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

import * as bcrypt from 'bcrypt';
import { Message } from "src/message/message.entity";
import { Topic } from "src/topic/topic.entity";

@Entity("user")
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: false })
    username: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: true })
    temporaryPassword?: string;

    @OneToMany(() => Message, message => message.user)
    messages: Message[];


    @OneToMany(() => Topic, (topic) => topic.user)
    topics: Topic[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    async hashPassword() {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
}
