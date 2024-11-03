import { UserData } from '../../users/schemas/user';
import { CategoryData } from '../schemas/category';

export interface Record {
  id: string;
  categoryId: string;
  userId: string;
  amount: number;
  description?: string;
  createdAt: Date;
}

export enum RecordErrorCode {
  NotFound = 'OTG_REC_ERR_NOT_FOUND',
}

export interface UsersIface {
  get(id: string): UserData;
}

export interface CategoriesIface {
  get(id: string): CategoryData;
}
