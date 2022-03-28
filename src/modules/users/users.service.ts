import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { EUserRole, EUserStatus } from 'src/constants/schema.constant';
import { IUserRegister } from '../auth/interfaces/auth.interface';
import { UpdateUserRequestDto, UserResponseDto } from './dtos/users.dto';
import { MongoId } from 'src/share/type/common.type';
import { httpNotFound } from 'src/share/exception/http-exception';
import { FilterQuery } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async getUserByAttribute(attribute?: FilterQuery<UserDocument>, select?: Object) {
    const query = this.userModel.findOne(attribute).select(select);
    if (select) {
      query.select(select);
    }
    return await query.exec();
  }

  async getUser(userId: MongoId) {
    const user = await this.userModel
      .findOne(
        { _id: userId, status: EUserStatus.ACTIVE, deletedAt: null },
        { email: true, fullName: true, address: true },
      )
      .lean()
      .exec();
    return new UserResponseDto(user);
  }

  async isActiveUser(userId: MongoId): Promise<boolean> {
    const user = await this.userModel.findOne(
      { _id: userId, status: EUserStatus.ACTIVE, deletedAt: null },
      { email: true, status: true },
    );
    return !!user;
  }

  async createUser(payload: IUserRegister) {
    const newUser = new this.userModel(payload);
    newUser.status = EUserStatus.ACTIVE;
    newUser.role = EUserRole.USER;

    return newUser.save();
  }

  async updateUser(userId: MongoId, data: UpdateUserRequestDto) {
    const user = await this.userModel.findOne({ _id: userId, status: EUserStatus.ACTIVE, deletedAt: null }).exec();
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
    await user.save();
    return true;
  }
}
