import { MongoId } from '../type/common.type';

export interface IJwtPayload {
  userId: MongoId;
  role: number;
}

export interface IPagination {
  page?: number;
  limit?: number;
}
