import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity("user")
export class User {
    @PrimaryGeneratedColumn()
    id: number;

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
}




