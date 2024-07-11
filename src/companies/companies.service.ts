import { Injectable } from '@nestjs/common';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { UserInterface } from 'src/users/users.interface';
import aqp from 'api-query-params';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private companyModel: SoftDeleteModel<CompanyDocument>,
  ) {}
  objectSlugToNormal(obj: any): any {
    const transformedObj: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (typeof obj[key] === 'string') {
          transformedObj[key] = obj[key].replace(/[_-]/g, ' ');
        } else {
          transformedObj[key] = obj[key];
        }
      }
    }
    return transformedObj;
  }
  async searchQuery(currentPage: number, limit: number, query: any) {
    delete query.current;
    delete query.pageSize;
    const {
      filter,
      sort,
      projection,
      population,
    }: { filter: any; sort: any; projection: any; population: any } =
      aqp(query);
    const result_all = await this.companyModel.find(filter);
    const result_query = await this.companyModel
      .find(filter)
      .limit(limit)
      .skip((currentPage - 1) * limit)
      .sort(sort)
      .select(projection)
      .populate(population)
      .exec();
    return {
      message: 'Get comppany is success',
      result: {
        meta: {
          current: currentPage,
          limit: limit,
          totalPages: Math.ceil(result_all.length / limit),
          totalItems: result_query.length,
        },
        result: result_query,
      },
    };
  }

  async create(createCompanyDto: CreateCompanyDto, user: UserInterface) {
    return await this.companyModel.create({
      ...createCompanyDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }
  async update(
    updateCompanyDto: UpdateCompanyDto,
    id: string,
    user: UserInterface,
  ) {
    const filter = { _id: id };
    return await this.companyModel.updateOne(filter, {
      ...updateCompanyDto,
      updateBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }

  async delete(id: string, user: UserInterface) {
    const filter = { _id: id };
    await this.companyModel.updateOne(filter, {
      deleteBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return await this.companyModel.softDelete(filter);
  }
}
