import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Subscriber, SubscriberDocument } from './schema/subscriber.entity';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import { UserInterface } from 'src/users/users.interface';
import mongoose from 'mongoose';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectModel(Subscriber.name)
    private subcriberModel: SoftDeleteModel<SubscriberDocument>,
  ) {}

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.subcriberModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.subcriberModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select('-password')
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  async findOne(id: string) {
    return await this.subcriberModel.findById({ id });
  }

  async create(user: UserInterface, subscriberDto: CreateSubscriberDto) {
    const isExist = await this.subcriberModel.findOne({
      email: subscriberDto.email,
    });
    if (isExist) {
      throw new BadRequestException(
        `Email: ${subscriberDto.email} đã tồn tại trên hệ thống. Vui lòng sử dụng email khác.`,
      );
    }
    return await this.subcriberModel.create({
      ...subscriberDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
  }

  async remove(id: string, user: UserInterface) {
    if (!mongoose.Types.ObjectId.isValid(id)) return `not found subcriber `;

    const foundUser = await this.subcriberModel.findById(id);
    if (foundUser.email === 'admin@gmail.com') {
      throw new BadRequestException('Không thể xóa subcriber này!');
    }

    await this.subcriberModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.subcriberModel.softDelete({
      _id: id,
    });
  }

  async update(user: UserInterface, subscriber: UpdateSubscriberDto) {
    console.log(user);
    return await this.subcriberModel.updateOne(
      { email: user.email },
      { ...subscriber, updatedBy: { _id: user._id, email: user.email } },
      { upsert: true },
    );
  }

  async getSkills(user: UserInterface) {
    const { email } = user;
    return await this.subcriberModel.findOne({ email }, { skills: 1 });
  }
}
