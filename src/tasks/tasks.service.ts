import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tasks } from './task.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Tasks)
    private taskRepository: Repository<Tasks>,
  ) {}

  async getTasks(filterDto: GetTaskFilterDto, user: User) {
    const query = this.taskRepository.createQueryBuilder('task');

    query.where({ user });

    if (filterDto.status) {
      query.andWhere('task.status = :status', { status: filterDto.status });
    }

    if (filterDto.search) {
      query.andWhere(
        '(LOWER(task.title) LIKE :search OR LOWER(task.description) LIKE (:search))',
        { search: `%${filterDto.search.toLowerCase()}%` },
      );
    }

    const task = await query.getMany();

    return task;
  }

  async getTaskById(id: string, user: User) {
    const found = await this.taskRepository.findOne({ where: { id, user } });

    if (!found) {
      throw new NotFoundException();
    }

    return found;
  }

  async deleteTaskById(id: string, user: User) {
    const result = await this.taskRepository.delete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }

  async updateStatusById(
    id,
    updateTaskStatusDto: UpdateTaskStatusDto,
    user: User,
  ) {
    const task = await this.getTaskById(id, user);
    task.status = updateTaskStatusDto.status;
    await this.taskRepository.save(task);
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User) {
    const { description, title } = createTaskDto;

    const task = this.taskRepository.create({
      description,
      title,
      status: TaskStatus.OPEN,
      user,
    });

    await this.taskRepository.save(task);
    return task;
  }
}
