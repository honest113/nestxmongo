import mongoose from 'mongoose';
import { Document, Model, FilterQuery, UpdateQuery } from 'mongoose';
import { isObservable, lastValueFrom } from 'rxjs';
import { IPagination } from 'src/share/interface/auth.interface';

export abstract class BaseRepository<T extends Document> {
  protected abstract entityDocument: T & Document;

  constructor(protected readonly entityModel: Model<T>, protected readonly connection: mongoose.Connection) {}

  getModel(): Model<T> {
    return this.entityModel;
  }

  saveWithTransaction(entity: T, session: mongoose.ClientSession | null = null) {
    return entity.save({ session: session });
  }

  async findOne(filterQuery: FilterQuery<T>, select?: Record<string, unknown>): Promise<T | null> {
    return this.entityModel
      .findOne(filterQuery, {
        ...select,
      })
      .exec();
  }

  async find(filterQuery: FilterQuery<T>): Promise<T[] | null> {
    return this.entityModel.find(filterQuery);
  }

  async create(createEntityData: unknown): Promise<T> {
    const entity = new this.entityModel(createEntityData);
    return entity.save();
  }

  async findOneAndUpdate(filterQuery: FilterQuery<T>, updateEntityData: UpdateQuery<unknown>): Promise<T | null> {
    return this.entityModel.findOneAndUpdate(filterQuery, updateEntityData, {
      new: true,
    });
  }

  async deleteMany(filterQuery: FilterQuery<T>): Promise<boolean> {
    const deleteResult = await this.entityModel.deleteMany(filterQuery);
    return deleteResult.deletedCount >= 1;
  }

  queryAddPagination(
    query: mongoose.Query<
      Omit<T & mongoose.Document<any, any, any> & { _id: any }, never>[],
      T & mongoose.Document<any, any, any> & { _id: any },
      {},
      T & Document
    >,
    data: Partial<IPagination>,
  ) {
    if (typeof data !== 'object') {
      return query;
    }
    if (data.page) {
      query.skip(data.page * (data?.limit || 20));
    }
    if (data.limit) {
      query.limit(data.limit);
    }
  }

  async createTransaction(...args: any[]) {
    const session = await this.connection.startSession();
    const arr = [] as any[];
    try {
      session.startTransaction();
      for (const iterator of args) {
        if (typeof iterator === 'function') {
          const res = iterator.call(this, session);
          if (isObservable(res)) {
            arr.push(await lastValueFrom(res));
          } else {
            arr.push(await res);
          }
        }
      }
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }

    return arr;
  }
}
