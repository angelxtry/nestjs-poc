import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../auth/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @ManyToOne((_type) => User, (user) => user.tasks, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
