import { Injectable } from '@nestjs/common';
import { genSaltSync, hashSync } from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  async create(userDTO: CreateUserDto) {
    const hash_password = this.getHashPassword(userDTO.password);
    const new_user = await this.userModel.create({
      name: userDTO.name,
      email: userDTO.email,
      password: hash_password,
    });

    return new_user;
  }


}
