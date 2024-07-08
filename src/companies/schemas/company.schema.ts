import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

export type CompanyDocument = HydratedDocument<Company>;
// export type CompanyDocument = Company & Document;

@Schema({ timestamps: true })
export class Company {
  @Prop()
  name: string;
  @Prop()
  address: string;
  @Prop()
  description: string;
  //***************************/
  @Prop()
  createdAt?: Date;
  @Prop()
  updateAt?: Date;
  @Prop()
  deleteAt?: Date;
  //***************************/
  @Prop()
  isDeleted?: boolean;
  //***************************/
  @Prop()
  createdBy: {
    _id: string;
    email: string;
  };
  @Prop()
  updateBy: {
    _id: string;
    email: string;
  };
  @Prop()
  deleteBy: {
    _id: string;
    email: string;
  };
}

export const CompanySchema =
  SchemaFactory.createForClass(Company).plugin(softDeletePlugin);
