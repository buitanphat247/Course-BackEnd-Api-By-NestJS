import { Transform, Type } from 'class-transformer';
import { IsString, IsInt, IsNotEmpty, ValidateNested } from 'class-validator';

export class RegisterUserDto {
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
}
