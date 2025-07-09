import { AfterLoad, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Task } from "./Task";
import bcrypt from "bcryptjs";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100, unique: true })
    email: string;

    @Column({ length: 255, nullable: false })
    password: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(() => Task, (task) => task.user)
    tasks?: Task[];

    private originalPassword?: string;

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }

    @AfterLoad()
    private setOriginalPassword() {
        this.originalPassword = this.password;
    }

    @BeforeInsert()
    @BeforeUpdate()
    private async hashPassword() {
        if (this.password && this.password !== this.originalPassword) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }

}