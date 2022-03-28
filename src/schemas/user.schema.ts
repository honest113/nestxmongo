import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Address, AddressSchema } from './address.schema';
import { IBaseAttribute, IDateDeletedAt } from './schema-attribute/base-attribute.interface';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User implements IBaseAttribute, IDateDeletedAt {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
    unique: true,
    maxlength: 255,
    set: (email: string) => {
      return email.trim();
    },
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: null })
  fullName: string;

  @Prop({ min: 1 })
  role: number;

  @Prop({ min: 1 })
  status: number;

  @Prop({ type: AddressSchema })
  address: Address;

  @Prop({ type: Date, required: true, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, required: true, default: Date.now })
  updatedAt: Date;

  @Prop({ type: Date })
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
