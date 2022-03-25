import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { EUserRole, EUserStatus } from 'src/constants/schema.constant';
import { IUserRegister } from '../auth/interfaces/auth.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async getUserByAttribute(attribute?: Partial<UserDocument>, select?: Object): Promise<UserDocument> {
    const query = this.userModel.findOne(attribute).select(select);
    if (select) {
      query.select(select);
    }
    return await query.exec();
  }

  async createUser(payload: IUserRegister) {
    const newUser = new this.userModel(payload);
    newUser.status = EUserStatus.ACTIVE;
    newUser.role = EUserRole.USER;

    return newUser.save();
  }
}
