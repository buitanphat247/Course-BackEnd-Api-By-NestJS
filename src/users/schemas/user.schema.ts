import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

export type UserDocument = HydratedDocument<User>;
// export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop()
  email: string;
  @Prop()
  password: string;
  @Prop()
  name: string;
  @Prop()
  phone: string;
  @Prop()
  age: number;
  @Prop()
  address: string;
  //***************************/
  @Prop()
  createdAt?: Date;
  @Prop()
  updatedAt?: Date;
  @Prop()
  deleteAt?: Date;
  //***************************/
  @Prop()
  isDeleted?: boolean;
}

export const UserSchema =
  SchemaFactory.createForClass(User).plugin(softDeletePlugin);
