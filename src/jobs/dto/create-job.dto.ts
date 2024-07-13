import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsInt,
  IsNotEmpty,
  ValidateNested,
  IsNotEmptyObject,
} from 'class-validator';
import mongoose from 'mongoose';

class companyDto {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  logo: string;
}

export class CreateJobDto {
  @IsNotEmpty()
  name?: string;
  @IsNotEmpty()
  skills: string[];
  @ValidateNested({ each: true })
  @Type(() => companyDto)
  company: companyDto;
  @IsNotEmpty()
  salary: number;
  @IsNotEmpty()
  quantity: string;
  @IsNotEmpty()
  level: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  startDate: Date;
  @IsNotEmpty()
  endDate: Date;
  @IsNotEmpty()
  location: string;
}
