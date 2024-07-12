import {
  Controller,
  Post,
  Body,
  Req,
  Patch,
  Param,
  Delete,
  Get,
  Query,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { UserInterface } from 'src/users/users.interface';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Public()
  @ResponseMessage('Get all companies')
  @Get()
  get(
    @Query('current') currentPage: number,
    @Query('pageSize') limit: number,
    @Query() query: any,
  ) {
    return this.companiesService.searchQuery(currentPage, limit, query);
  }

  @Public()
  @ResponseMessage('Get a new company by id')
  @Get(':id')
  getCompanyById(
    @Param('id') id: string,
    @Body() createCompanyDto: CreateCompanyDto,
    @User() user: UserInterface,
  ) {
    return this.companiesService.getCompanyById(id);
  }

  @ResponseMessage('Create a new company')
  @Post()
  create(
    @Body() createCompanyDto: CreateCompanyDto,
    @User() user: UserInterface,
  ) {
    return this.companiesService.create(createCompanyDto, user);
  }

  @ResponseMessage('Update a company by id')
  @Patch(':id')
  update(
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Param('id') id: string,
    @User() user: UserInterface,
  ) {
    // console.log('id: ', id);
    return this.companiesService.update(updateCompanyDto, id, user);
  }
  @ResponseMessage('Delete a company by id')
  @Delete(':id')
  delete(@Param('id') id: string, @User() user: UserInterface) {
    return this.companiesService.delete(id, user);
  }
}
