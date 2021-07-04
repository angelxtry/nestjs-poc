import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { UnprocessableEntityException } from '@nestjs/common';
import { FilterDto } from './dto/filter.dto';
import { User } from '../auth/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<void> {
    const { title, description } = createTaskDto;
    try {
      const task = await this.create({
        title,
        description,
        status: TaskStatus.OPEN,
        user,
      });
      await this.save(task);
    } catch {
      throw new UnprocessableEntityException('Task create error.');
    }
  }

  async getTasks(filterDto: FilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where({ user });
    if (status) query.andWhere('task.status = :status', { status });
    if (search)
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%${search}%` },
      );
    return query.getMany();
  }
}
