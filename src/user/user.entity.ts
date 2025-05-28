import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

import * as bcrypt from 'bcrypt';

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
}




