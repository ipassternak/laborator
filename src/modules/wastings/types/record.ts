import { UserData } from '../../users/schemas/user';

export interface Record {
  id: string;
  categoryId: string;
  userId: string;
  amount: number;
  description?: string;
  createdAt: Date;
}

export enum RecordErrorCode {
  NotFound = 'WST_REC_ERR_NOT_FOUND',
}

export interface UsersIface {
  get(id: string): UserData;
}
