import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateCompanyDTO {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  address: string;
  @IsNotEmpty()
  description: string;
}
