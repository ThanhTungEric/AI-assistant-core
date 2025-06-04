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

    @OneToMany(() => Message, message => message.user)
    messages: Message[];

    // automatically set the timestamp when the user is created
    @CreateDateColumn()
    createdAt: Date;

    // automatically set the timestamp when the user is updated
    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    // hash the password before inserting it into the database
    async hashPassword() {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }

    // token used to reset the user password
    @Column({ nullable: true })
    resetToken: string;

    // expiration time for the reset token
    @Column({ type: 'timestamp', nullable: true })
    resetTokenExpiresAt: Date;
}




