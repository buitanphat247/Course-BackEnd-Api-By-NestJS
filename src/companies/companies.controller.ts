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
import { ResponseMessage, User } from 'src/decorator/customize';
import { UserInterface } from 'src/users/users.interface';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  @ResponseMessage('Fetched Stats Succesfully')
  get(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query() query: any,
  ) {
    return this.companiesService.searchQuery(page, limit, query);
  }

  @Post()
  create(
    @Body() createCompanyDto: CreateCompanyDto,
    @User() user: UserInterface,
  ) {
    return this.companiesService.create(createCompanyDto, user);
  }

  @Patch(':id')
  update(
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Param('id') id: string,
    @User() user: UserInterface,
  ) {
    // console.log('id: ', id);
    return this.companiesService.update(updateCompanyDto, id, user);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @User() user: UserInterface) {
    return this.companiesService.delete(id, user);
  }
}
