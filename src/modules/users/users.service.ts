import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { UserDocument } from 'src/schemas/user.schema';
import { EUserRole, EUserStatus } from 'src/constants/schema.constant';
import { IUserRegister } from '../auth/interfaces/auth.interface';
import { UpdateUserRequestDto, UserResponseDto } from './dtos/users.dto';
import { MongoId } from 'src/share/type/common.type';
import { httpNotFound } from 'src/share/exception/http-exception';
import { FilterQuery } from 'mongoose';
import mongoose from 'mongoose';
import { PostsService } from '../posts/posts.service';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @InjectConnection()
    private readonly connection: mongoose.Connection,
    @Inject(forwardRef(() => PostsService))
    private readonly postsService: PostsService,
  ) {}

  async getUserByAttribute(attribute?: FilterQuery<UserDocument>, select?: Object) {
    const query = this.usersRepository.getModel().findOne(attribute);
    if (select) {
      query.select(select);
    }
    return await query.exec();
  }

  async getUser(userId: MongoId) {
    const user = await this.usersRepository
      .getModel()
      .findOne(
        { _id: userId, status: EUserStatus.ACTIVE, deletedAt: null },
        { email: true, fullName: true, address: true },
      )
      .lean()
      .exec();
    return new UserResponseDto(user);
  }

  async isActiveUser(userId: MongoId): Promise<boolean> {
    const user = await this.usersRepository
      .getModel()
      .findOne({ _id: userId, status: EUserStatus.ACTIVE, deletedAt: null }, { email: true, status: true });
    return !!user;
  }

  async createUser(payload: IUserRegister) {
    const model = this.usersRepository.getModel();
    const newUser = new model(payload);
    newUser.status = EUserStatus.ACTIVE;
    newUser.role = EUserRole.USER;

    return newUser.save();
  }

  async updateUser(userId: MongoId, data: UpdateUserRequestDto) {
    const user = await this.usersRepository
      .getModel()
      .findOne({ _id: userId, status: EUserStatus.ACTIVE, deletedAt: null })
      .exec();
    if (!user) {
      httpNotFound();
    }
    Object.assign(user, data);
    return await user.save();
  }

  async deleteUser(userId: MongoId) {
    const user = await this.getUserByAttribute({ _id: userId, deletedAt: null, status: EUserStatus.ACTIVE });
    if (!user) {
      httpNotFound();
    }

    user.deletedAt = new Date();

    const data = await this.usersRepository.createTransaction(
      this.usersRepository.saveWithTransaction.bind(this, user),
      this.postsService.deletePostWithAuthorId.bind(this.postsService, userId),
    );

    // const session = await this.connection.startSession();
    // session.startTransaction();
    // try {
    //   user.deletedAt = new Date();
    //   // await user.save({ session: session });
    //   await this.usersRepository.saveWithTransaction(user, session);
    //   await this.postsService.deletePostWithAuthorId(userId, session);
    //   await session.commitTransaction();
    // } catch (error) {
    //   await session.abortTransaction();
    //   throw error;
    // } finally {
    //   await session.endSession();
    // }
    return true;
  }
}
