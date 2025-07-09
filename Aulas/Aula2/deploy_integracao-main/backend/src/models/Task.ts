import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";

export enum TaskStatus {
    Pending = 'pending',
    InProgress = 'in_progress',
    Completed = 'completed'
}

@Entity('tasks')
export class Task {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 255, nullable: false })
    title: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.Pending })
    status?: TaskStatus;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne(() => User, (user) => user.tasks, { nullable: false })
    user!: User;

    constructor(title: string, description?: string, status: TaskStatus = TaskStatus.Pending) {
        this.title = title;
        this.description = description;
        this.status = status;
    }

}