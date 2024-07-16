import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { UserInterface } from './users.interface';

@Controller('users') // => /users
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ResponseMessage("Create a new User")
  async create(@Body() hoidanit: CreateUserDto, @User() user: UserInterface) {
    let newUser = await this.usersService.create(hoidanit, user);
    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt
    };
  }

  @Get()
  @ResponseMessage("Fetch list Users with paginate")
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string,) {
    return this.usersService.findAll(+currentPage, +limit, qs);
  }

  @Public()
  @Get(':id')
  @ResponseMessage("Fetch User by id")
  async findOne(@Param('id') id: string) {
    const foundUser = await this.usersService.findOne(id);
    return foundUser;
  }

  @ResponseMessage("Update a User  by id")
  @Patch()
  async update(@Body() updateUserDto: UpdateUserDto, @User() user: UserInterface) {
    let updatedUser = await this.usersService.update(updateUserDto, user);
    return updatedUser;
  }

  @Delete(':id')
  @ResponseMessage("Delete a User by id")
  remove(@Param('id') id: string, @User() user: UserInterface) {
    return this.usersService.remove(id, user);
  }
}
