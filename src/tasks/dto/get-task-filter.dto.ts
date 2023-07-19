import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class GetTaskFilterDto {
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsString()
  @IsOptional()
  search?: string;
}
