import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { UserInterface } from 'src/users/users.interface';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @ResponseMessage('Create a new job')
  @Post()
  async create(
    @Body() createJobDto: CreateJobDto,
    @User() user: UserInterface,
  ) {
    return await this.jobService.create(createJobDto, user);
  }

  @ResponseMessage('Update a new job')
  @Patch(':id')
  async update(
    @Body() updateJobDto: UpdateJobDto,
    @User() user: UserInterface,
    @Param('id') id: string,
  ) {
    return await this.jobService.update(updateJobDto, user, id);
  }

  @Public()
  @Get()
  @ResponseMessage('Get all jobs')
  async getJobWithPaginate(
    @Query('current') currentPage: number,
    @Query('pageSize') limit: number,
    @Query() query: any,
  ) {
    return await this.jobService.searchQuery(currentPage, limit, query);
  }

  @Public()
  @ResponseMessage('Get job by id')
  @Get(':id')
  async get(@Param('id') id: string) {
    return await this.jobService.getJobById(id);
  }

  @ResponseMessage('Delete a job')
  @Delete(':id')
  async delete(@Param('id') id: string, @User() user: UserInterface) {
    return await this.jobService.delete(id, user);
  }
}
