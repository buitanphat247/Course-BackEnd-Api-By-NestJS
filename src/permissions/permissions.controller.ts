import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  Query,
  Delete,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UserInterface } from 'src/users/users.interface';
import { ResponseMessage, User } from 'src/decorator/customize';
import expressListEndpoints from 'express-list-endpoints';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  create(
    @Body() createPermissionDto: CreatePermissionDto,
    @User() user: UserInterface,
  ) {
    return this.permissionsService.create(createPermissionDto, user);
  }
  @Patch(':id')
  update(
    @Body() updatePermissionDto: UpdatePermissionDto,
    @User() user: UserInterface,
    @Param('id') id: string,
  ) {
    return this.permissionsService.update(updatePermissionDto, user, id);
  }

  @Get()
  @ResponseMessage('Fetched Stats Succesfully')
  async getPermissionWithPaginate(
    @Query('current') currentPage: number,
    @Query('pageSize') limit: number,
    @Query() query: any,
  ) {
    return await this.permissionsService.searchQuery(currentPage, limit, query);
  }

  @ResponseMessage('Get permission by id')
  @Get(':id')
  async getPermissionById(@Param('id') id: string) {
    return await this.permissionsService.getPermissionById(id);
  }

  @ResponseMessage('Delete a permission')
  @Delete(':id')
  async delete(@Param('id') id: string, @User() user: UserInterface) {
    return await this.permissionsService.delete(id, user);
  }
}
