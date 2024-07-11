import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Get,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { UserInterface } from './users.interface';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ResponseMessage('Get user by id')
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const result = await this.usersService.getUserById(id);
    return {
      message: 'Get user by id: ' + id + ' is success',
      result,
    };
  }

  @Get()
  @ResponseMessage('Fetched Stats Succesfully')
  async getUserWithPaginate(
    @Query('current') currentPage: number,
    @Query('pageSize') limit: number,
    @Query() query: any,
  ) {
    return await this.usersService.searchQuery(currentPage, limit, query);
  }

  @ResponseMessage('Register a new user')
  @Post()
  async create(@Body() userDto: CreateUserDto, @User() user: UserInterface) {
    const result = await this.usersService.create(userDto, user);
    return {
      message: 'Register a new user is success',
      result,
    };
  }

  @ResponseMessage('Update a user')
  @Patch(':id')
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @User() user: UserInterface,
    @Param('id') id: string,
  ) {
    const result = await this.usersService.update(updateUserDto, user, id);
    return {
      message: 'Update a user is success',
      result,
    };
  }

  @ResponseMessage('Delete a user')
  @Delete(':id')
  async delete(@Param('id') id: string, @User() user: UserInterface) {
    const result = await this.usersService.delete(id, user);
    return {
      message: 'Delete a user is success',
      result,
    };
  }
}
