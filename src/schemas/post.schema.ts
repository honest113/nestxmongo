import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { MongoId } from 'src/share/type/common.type';
import { IBaseAttribute, IDateDeletedAt } from './schema-attribute/base-attribute.interface';
import { User } from './user.schema';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema()
export class Post implements IBaseAttribute, IDateDeletedAt {
  _id: MongoId;

  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  author: User;

  @Prop({ type: Date, required: true, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, required: true, default: Date.now })
  updatedAt: Date;

  @Prop({ type: Date })
  deletedAt: Date;
}

const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.pre<Post>('save', function (this: Post) {
  this.updatedAt = new Date();
});

export { PostSchema };
