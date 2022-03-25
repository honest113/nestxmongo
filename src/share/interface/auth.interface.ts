import { MongoId } from '../type/common.type';

export interface IJwtPayload {
  userId: MongoId;
  role: number;
}
