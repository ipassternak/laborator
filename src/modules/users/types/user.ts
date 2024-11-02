export interface User {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserErrorCode {
  NameAlreadyInUse = 'USR_ERR_NAME_ALREADY_IN_USE',
  NotFound = 'USR_ERR_NOT_FOUND',
}
