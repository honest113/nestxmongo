import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MongoId } from 'src/share/type/common.type';

export type AddressDocument = Address & Document;

@Schema()
export class Address {
  _id: MongoId;

  @Prop()
  city: string;

  @Prop()
  street: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
