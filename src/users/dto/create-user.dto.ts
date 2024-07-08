import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  phone: string;
  @IsNotEmpty()
  age: number;
  @IsNotEmpty()
  address: string;
}
