import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query() filterDto: GetTaskFilterDto, @GetUser() user: User) {
    this.logger.log(
      `User "${user.username}" retrieving all tasks. Filters: "${JSON.stringify(
        filterDto,
      )}"`,
    );
    return this.tasksService.getTasks(filterDto, user);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string, @GetUser() user: User) {
    return this.tasksService.getTaskById(id, user);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id') id: string, @GetUser() user: User) {
    return this.tasksService.deleteTaskById(id, user);
  }

  @Patch('/:id/status')
  updateStatusById(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ) {
    return this.tasksService.updateStatusById(id, updateTaskStatusDto, user);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
    return this.tasksService.createTask(createTaskDto, user);
  }
}
