import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserRequestDto } from './dtos/users.dto';
import { EUserRole, EUserStatus } from 'src/constants/schema.constant';
import { httpBadRequest } from 'src/share/exception/http-exception';
import { EError } from 'src/constants/error-code.constant';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(payload: CreateUserRequestDto) {
    const user = await this.userModel.findOne({ email: payload.email });
    if (user) httpBadRequest('Email Exist', EError.E_101);

    const newUser = new this.userModel(payload);
    newUser.status = EUserStatus.ACTIVE;
    newUser.role = EUserRole.USER;

    return newUser.save();
  }
}
