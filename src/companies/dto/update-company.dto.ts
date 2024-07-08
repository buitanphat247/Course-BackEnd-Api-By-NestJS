import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateCompanyDTO } from './create-company.dto';

export class UpdateCompanyDto extends PickType(CreateCompanyDTO, [
  'name',
  'address',
  'description',
]) {}
