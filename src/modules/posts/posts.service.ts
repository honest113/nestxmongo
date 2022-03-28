import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from 'src/schemas/post.schema';
import { Model } from 'mongoose';
import { CreatePostRequestDto, ListPostDataResponseDto } from './dtos/posts.dto';
import { UsersService } from '../users/users.service';
import { EUserStatus } from 'src/constants/schema.constant';
import { httpNotFound, httpUnauthorized } from 'src/share/exception/http-exception';
import { MongoId } from 'src/share/type/common.type';
import { IPagination } from 'src/share/interface/auth.interface';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    private readonly usersService: UsersService,
  ) {}

  async createPost(authorId: MongoId, payload: CreatePostRequestDto) {
    const author = await this.usersService.getUserByAttribute({
      _id: authorId,
      deletedAt: null,
      status: EUserStatus.ACTIVE,
    });
    if (!author) httpUnauthorized();

    const newPost = new this.postModel(payload);
    newPost.author = author;
    await newPost.save();
    return newPost._id;
  }

  async getListPosts(pagination: IPagination) {
    const query = this.postModel.find({ deletedAt: null }).populate('author');
    if (pagination?.page) {
      query.skip(pagination.page * (pagination?.limit || 20));
    }
    if (pagination?.limit) {
      query.limit(pagination.limit);
    }
    const listPosts = await query.lean().exec();
    const listData = listPosts.map(item => new ListPostDataResponseDto(item));
    return listData;
  }

  async getPostById(postId: string) {
    const post = await this.postModel
      .findOne({ id: postId, deletedAt: null })
      .populate({
        path: 'author',
        match: { deletedAt: null },
      })
      .lean()
      .exec();

    if (!post || !post?.author) httpNotFound('Post Not Found');
    return new ListPostDataResponseDto(post);
  }

  async updatePost(authorId: MongoId, postId: string, payload: CreatePostRequestDto) {
    const post = await this.postModel.findOne({ _id: postId, deletedAt: null, author: authorId }).exec();
    if (!post) httpNotFound('Post Not Found');

    Object.assign(post, payload);
    await post.save();
    return post.id;
  }

  async deletePost(authorId: MongoId, postId: string) {
    const post = await this.postModel.findOne({ id: postId, author: authorId, deletedAt: null }).exec();
    if (!post) httpNotFound('Post Not Found');

    post.deletedAt = new Date();
    await post.save();
    return true;
  }
}
