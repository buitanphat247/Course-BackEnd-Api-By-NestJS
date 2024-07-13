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
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { UserInterface } from 'src/users/users.interface';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}
  @Post()
  @ResponseMessage('Create a new resumes')
  create(
    @Body() createResumeDto: CreateResumeDto,
    @User() user: UserInterface,
  ) {
    return this.resumesService.create(createResumeDto, user);
  }

  @Get()
  @ResponseMessage('Fetched Stats Succesfully')
  async getUserWithPaginate(
    @Query('current') currentPage: number,
    @Query('pageSize') limit: number,
    @Query() query: any,
  ) {
    return await this.resumesService.searchQuery(currentPage, limit, query);
  }

  @Get(':id')
  @ResponseMessage('Get resume by id')
  async getResumeById(@Param('id') id: string) {
    return await this.resumesService.getResumeById(id);
  }
  @Patch(':id')
  @ResponseMessage('Fetched Stats Succesfully')
  async updateResume(
    @Param('id') id: string,
    @Body() data: any,
    @User() user: UserInterface,
  ) {
    return await this.resumesService.updateResumeById(id, data, user);
  }

  @Delete(':id')
  @ResponseMessage('Fetched Stats Succesfully')
  async deleteResumeById(@Param('id') id: string, @User() user: UserInterface) {
    return await this.resumesService.deleteResumeById(id, user);
  }

  @Post('/by-user')
  @ResponseMessage('Get all cv user send')
  async createResume(@User() user: UserInterface) {
    return await this.resumesService.getAllCvUserSend(user);
  }
}
