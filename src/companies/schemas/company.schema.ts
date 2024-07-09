import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
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
  updatedAt?: Date;
  @Prop()
  deletedAt?: Date;
  //***************************/
  @Prop()
  isDeleted?: boolean;
  //***************************/
  @Prop({ type: Object })
  createdBy: {
    _id:  mongoose.Schema.Types.ObjectId;
    email: string;
  };
  @Prop({ type: Object })
  updatedBy: {
    _id:  mongoose.Schema.Types.ObjectId;
    email: string;
  };
  @Prop({ type: Object })
  deletedBy: {
    _id:  mongoose.Schema.Types.ObjectId;
    email: string;
  };
}

export const CompanySchema =
  SchemaFactory.createForClass(Company).plugin(softDeletePlugin);
