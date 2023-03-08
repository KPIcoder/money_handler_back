import { Types } from 'mongoose';

export type MongoResWithId<T> = {
  _id: Types.ObjectId;
} & T;
