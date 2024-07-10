import { Transform, Type } from 'class-transformer';
import { IsString, IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import mongoose from 'mongoose';

class companyDto {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  address: string;
}

export class CreateUserDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  age: string;
  @IsNotEmpty()
  gender: string;
  @IsNotEmpty()
  address: string;
  @ValidateNested({ each: true })
  @Type(() => companyDto)
  company: companyDto;
  @IsNotEmpty()
  role: string;
}
