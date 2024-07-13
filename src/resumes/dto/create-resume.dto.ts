import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreateResumeDto {
  @IsNotEmpty()
  companyId: mongoose.Schema.Types.ObjectId;
  @IsNotEmpty()
  jobId: mongoose.Schema.Types.ObjectId;
  @IsNotEmpty()
  url: string;
}
