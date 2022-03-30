import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/core/base-repository';
import { Post, PostDocument } from 'src/schemas/post.schema';
import { IPagination } from 'src/share/interface/auth.interface';

@Injectable()
export class PostsRepository extends BaseRepository<PostDocument> {
  protected entityDocument: PostDocument;
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<PostDocument>,
    @InjectConnection()
    protected readonly connection: mongoose.Connection,
  ) {
    super(postModel, connection);
  }

  getListPost(pagination: IPagination) {
    const query = this.postModel.find({ deletedAt: null }).populate('author');
    const { page, limit } = pagination;
    this.queryAddPagination(query, { page, limit });
    return query.lean().exec();
  }
}
