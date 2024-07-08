import { Injectable } from '@nestjs/common';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private companyModel: SoftDeleteModel<CompanyDocument>,
  ) {}
  async create(createCompanyDto: CreateCompanyDto) {
    return await this.companyModel.create(createCompanyDto);
  }
}
