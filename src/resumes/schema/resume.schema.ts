export class Resume {}
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import mongoose, { HydratedDocument } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { History } from '../dto/create-resume.dto';

export type ResumesDocument = HydratedDocument<Resumes>;
// export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class Resumes {
  @Prop()
  email: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: mongoose.Schema.Types.ObjectId;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Company' })
  companyId: mongoose.Schema.Types.ObjectId;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Job' })
  jobId: mongoose.Schema.Types.ObjectId;
  @Prop()
  url: string;
  @Prop()
  status: string;
  @Prop()
  history: {
    status: string;
    updatedAt: Date;
    updatedBy: {
      _id: string;
      email: string;
    };
  }[];
  //***************************/
  @Prop()
  createdAt?: Date;
  @Prop()
  updatedAt?: Date;
  @Prop()
  deletedAt?: Date;
  //***************************/
  @Prop()
  isDeleted?: boolean;
  @Prop()
  isActive?: boolean;
  //***************************/
  @Prop({ type: Object })
  createdBy?: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
  @Prop({ type: Object })
  updatedBy?: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
  @Prop({ type: Object })
  deletedBy?: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
}

export const ResumesSchema =
  SchemaFactory.createForClass(Resumes).plugin(softDeletePlugin);
