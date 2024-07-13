import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

export type RoleDocument = HydratedDocument<Role>;
// export type RoleDocument = Role & Document;

@Schema({ timestamps: true })
export class Role {
  @Prop()
  name: string;
  @Prop()
  apiPath: string;
  @Prop()
  method: string;
  @Prop()
  module: string;
  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }])
  permission: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
  }[];
  //***************************/
  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
  @Prop()
  deletedAt: Date;
  //***************************/
  @Prop()
  isDeleted: boolean;
  @Prop()
  isActive: boolean;
  //***************************/
  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
}

export const RoleSchema =
  SchemaFactory.createForClass(Role).plugin(softDeletePlugin);
