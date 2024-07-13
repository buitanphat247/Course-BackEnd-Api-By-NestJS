import { BadGatewayException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission, PermissionDocument } from './schema/permission.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserInterface } from 'src/users/users.interface';
import { NestApplication, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from 'src/app.module';
import aqp from 'api-query-params';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private PermissionModel: SoftDeleteModel<PermissionDocument>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto, user: UserInterface) {
    const { apiPath, method, module, name } = createPermissionDto;
    const isExit = await this.PermissionModel.findOne({ apiPath, method });
    if (isExit) {
      throw new BadGatewayException(
        `Permission apiPath=${apiPath} and Method=${method} already exist`,
      );
    }
    return {
      message: 'Create permission is success',
      result: await this.PermissionModel.create({
        ...createPermissionDto,
        createdBy: {
          _id: user._id,
          email: user.email,
        },
      }),
    };
  }

  async searchQuery(currentPage: number, limit: number, query: any) {
    delete query.current;
    delete query.pageSize;
    const {
      filter,
      sort,
      projection,
      population,
    }: { filter: any; sort: any; projection: any; population: any } =
      aqp(query);
    const result_all = await this.PermissionModel.find(filter);
    const result_query = await this.PermissionModel.find(filter)
      .limit(limit)
      .skip((currentPage - 1) * limit)
      .sort(sort)
      .select(projection)
      .populate(population)
      .exec();
    return {
      message: 'Get permission is success',
      result: {
        meta: {
          current: currentPage,
          limit: limit,
          totalPages: Math.ceil(result_all.length / limit),
          totalItems: result_query.length,
        },
        result: result_query,
      },
    };
  }

  async update(
    updatePermissionDto: UpdatePermissionDto,
    user: UserInterface,
    id: string,
  ) {
    return {
      message: `Update permission by id ${id} is succcess`,
      result: await this.PermissionModel.findOneAndUpdate(
        { _id: id },
        {
          ...updatePermissionDto,
          updatedBy: { _id: user._id, email: user.email },
        },
      ),
    };
  }
  async getPermissionById(id: string) {
    return {
      message: `Get permission by id ${id} is succcess`,
      result: await this.PermissionModel.findById(id).exec(),
    };
  }

  async delete(id: string, user: UserInterface) {
    await this.PermissionModel.findOneAndUpdate(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return {
      message: `Delete permission by id ${id} is succcess`,
      result: await this.PermissionModel.softDelete({ _id: id }),
    };
  }
}
