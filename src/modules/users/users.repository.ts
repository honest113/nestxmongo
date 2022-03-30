import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/core/base-repository';
import mongoose from 'mongoose';

@Injectable()
export class UsersRepository extends BaseRepository<UserDocument> {
  protected entityDocument: UserDocument;

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectConnection()
    protected readonly connection: mongoose.Connection,
  ) {
    super(userModel, connection);
  }
}
