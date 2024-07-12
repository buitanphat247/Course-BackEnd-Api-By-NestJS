import { Injectable } from '@nestjs/common';
import { Job, JobDocument } from './schema/job.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateJobDto } from './dto/create-job.dto';
import { UserInterface } from 'src/users/users.interface';
import { formatISO, parse } from 'date-fns';
import { UpdateJobDto } from './dto/update-job.dto';
import aqp from 'api-query-params';

@Injectable()
export class JobService {
  constructor(
    @InjectModel(Job.name) private jobModel: SoftDeleteModel<JobDocument>,
  ) {}
  convertToISO(dateString: string): string {
    const date = parse(dateString, 'dd/MM/yyyy', new Date());
    return formatISO(date);
  }
  async create(createJobDto: CreateJobDto, user: UserInterface) {
    return {
      message: 'Create a new job is success',
      result: await this.jobModel.create({
        ...createJobDto,
        createdBy: {
          _id: user._id,
          email: user.email,
        },
        startDate: this.convertToISO(createJobDto.startDate),
        endDate: this.convertToISO(createJobDto.endDate),
      }),
    };
  }
  async update(updateJobDto: UpdateJobDto, user: UserInterface, id: string) {
    return {
      message: 'Update a new job is success',
      result: await this.jobModel.findOneAndUpdate(
        { _id: id },
        {
          ...updateJobDto,
          updatedBy: {
            _id: user._id,
            email: user.email,
          },
          startDate: this.convertToISO(updateJobDto.startDate),
          endDate: this.convertToISO(updateJobDto.endDate),
        },
      ),
    };
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
    const result_all = await this.jobModel.find(filter);
    const result_query = await this.jobModel
      .find(filter)
      .limit(limit)
      .skip((currentPage - 1) * limit)
      .sort(sort)
      .select(projection)
      .populate(population)
      .exec();
    return {
      message: 'Get job is success',
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
  async getJobById(id: string) {
    return {
      message: `Get job by id: ${id} is success`,
      result: await this.jobModel.findById(id),
    };
  }

  async delete(id: string, user: UserInterface) {
    await this.jobModel.findOneAndUpdate(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return {
      message: `Delete job by id: ${id} is success`,
      result: await this.jobModel.softDelete({ _id: id }),
    };
  }
}
