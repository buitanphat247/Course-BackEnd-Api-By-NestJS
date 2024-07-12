import { Transform, Type } from 'class-transformer';
import { IsString, IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
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
  @IsString({ each: true })
  skills: string[];
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
