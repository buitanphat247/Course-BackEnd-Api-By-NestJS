import { Injectable } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Resumes, ResumesDocument } from './schema/resume.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import { UserInterface } from 'src/users/users.interface';

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resumes.name)
    private resumesModel: SoftDeleteModel<ResumesDocument>,
  ) {}
  async create(createResumeDto: CreateResumeDto, user: UserInterface) {
    return {
      message: 'Create new resume is success',
      result: await this.resumesModel.create({
        ...createResumeDto,
        email: user.email,
        userId: user._id,
        status: 'PENDING',
        createdBy: {
          _id: user._id,
          email: user.email,
        },
        history: [
          {
            status: 'PENDING',
            updatedAt: new Date(),
            updatedBy: {
              _id: user._id,
              email: user.email,
            },
          },
        ],
      }),
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
    const result_all = await this.resumesModel.find(filter);
    const result_query = await this.resumesModel
      .find(filter)
      .limit(limit)
      .skip((currentPage - 1) * limit)
      .sort(sort)
      .select(projection)
      .populate(population)
      .exec();
    return {
      message: 'Get resumes is success',
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
  async getResumeById(id: string) {
    return {
      message: `Get resume by id ${id} is success`,
      result: await this.resumesModel.findById(id),
    };
  }

  async updateResumeById(id: string, data: any, user: UserInterface) {
    const get_resume_id = await this.getResumeById(id);
    get_resume_id.result.status = data.status;
    return {
      message: `Update resume by id ${id} is success`,
      result: await this.resumesModel.findByIdAndUpdate(
        id,
        {
          ...get_resume_id.result,
          updatedBy: {
            _id: user._id,
            email: user.email,
          },
          history: get_resume_id.result.history.push({
            status: data.status,
            updatedAt: new Date(),
            updatedBy: {
              _id: user._id,
              email: user.email,
            },
          }),
        },
        { new: true },
      ),
    };
  }

  async deleteResumeById(id: string, user: UserInterface) {
    await this.resumesModel.findOneAndUpdate(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return {
      message: `Delete resume by id ${id} is success`,
      result: await this.resumesModel.softDelete({ _id: id }),
    };
  }

  async getAllCvUserSend(user: UserInterface) {
    const { _id } = user;
    return {
      message: `Get all cv send by user ${_id} is success`,
      result: await this.resumesModel.find({ userId: _id }),
    };
  }
}
