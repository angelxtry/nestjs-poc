import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { UnprocessableEntityException } from '@nestjs/common';
import { FilterDto } from './dto/filter.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDto): Promise<void> {
    const { title, description } = createTaskDto;
    try {
      const task = await this.create({
        title,
        description,
        status: TaskStatus.OPEN,
      });
      await this.save(task);
    } catch {
      throw new UnprocessableEntityException('Task create error.');
    }
  }

  async getTasks(filterDto: FilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    if (status) query.andWhere('task.status = :status', { status });
    if (search)
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%${search}%` },
      );
    return query.getMany();
  }
}
