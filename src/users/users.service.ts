import { ConflictException, Injectable } from '@nestjs/common';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { UserInterface } from './users.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
  ) {}

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  async getUserById(id: string) {
    return await this.userModel.findById(id).exec();
  }

  async searchQuery(page: number, limit: number, query: any) {
    delete query.page;
    delete query.limit;
    const {
      filter,
      sort,
      projection,
      population,
    }: { filter: any; sort: any; projection: any; population: any } =
      aqp(query);
    const result_all = await this.userModel.find(filter);
    const result_query = await this.userModel
      .find(filter)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort(sort)
      .select(projection)
      .populate(population)
      .exec();
    return {
      meta: {
        current: page,
        limit: limit,
        totalPages: Math.ceil(result_all.length / limit),
        totalItems: result_query.length,
      },
      result: result_query,
    };
  }

  async create(userDto: CreateUserDto, user: UserInterface) {
    const existingUser = await this.userModel.findOne({
      email: userDto.email,
    });
    if (existingUser) {
      throw new ConflictException('Email đã tồn tại trong hệ thống');
    }
    const hash_password = this.getHashPassword(userDto.password);
    const new_user = await this.userModel.create({
      ...userDto,
      password: hash_password,
    });

    return {
      _id: new_user._id,
      createdAt: new_user.createdAt,
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    // Kiểm tra xem email đã tồn tại hay chưa
    const existingUser = await this.userModel.findOne({
      email: registerUserDto.email,
    });
    if (existingUser) {
      throw new ConflictException('Email đã tồn tại trong hệ thống');
    }

    const result = await this.userModel.create({
      ...registerUserDto,
      password: this.getHashPassword(registerUserDto.password),
      role: 'USER',
    });
    return {
      message: 'Register user is success',
      result: {
        _id: result._id,
        createdAt: result.createdAt,
      },
    };
  }

  async update(updateUserDto: UpdateUserDto, user: UserInterface, id: string) {
    return await this.userModel.findOneAndUpdate(
      { _id: id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async delete(id: string, user: UserInterface) {
    await this.userModel.findOneAndUpdate(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return await this.userModel.softDelete({ _id: id });
  }

  async findOneByUsername(username: string) {
    return await this.userModel.findOne({
      email: username,
    });
  }

  checkPassword(password: string, hash_password: string) {
    return compareSync(password, hash_password);
  }
}
