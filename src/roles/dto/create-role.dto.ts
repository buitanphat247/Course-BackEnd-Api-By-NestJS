import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import mongoose from 'mongoose';
class PermissionDto {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;
  @IsNotEmpty()
  name: string;
}
export class CreateRoleDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  apiPath: string;

  @IsNotEmpty()
  method: string;

  @IsNotEmpty()
  module: string;

  @ValidateNested({ each: true })
  @Type(() => PermissionDto)
  permission: PermissionDto[];
}
