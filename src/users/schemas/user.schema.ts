import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

export type UserDocument = HydratedDocument<User>;
// export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop()
  name?: string;
  @Prop()
  email?: string;
  @Prop()
  password?: string;
  @Prop()
  age?: string;
  @Prop()
  gender?: string;
  @Prop()
  address?: string;
  @Prop({ type: Object })
  company?: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    address: string;
  };
  @Prop()
  role?: string;
  @Prop()
  refreshToken?: string;
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

export const UserSchema =
  SchemaFactory.createForClass(User).plugin(softDeletePlugin);
