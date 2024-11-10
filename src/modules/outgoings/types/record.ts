import { UserData } from '../../users/schemas/user';
import { CategoryData } from '../schemas/category';

export enum RecordErrorCode {
  NotFound = 'OTG_REC_ERR_NOT_FOUND',
}

export interface UsersIface {
  get(id: string): Promise<UserData>;
}

export interface CategoriesIface {
  get(id: string): Promise<CategoryData>;
}
