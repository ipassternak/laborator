export interface Category {
  id: string;
  name: string;
}

export enum CategoryErrorCode {
  NameAlreadyInUse = 'WST_CTG_ERR_NAME_ALREADY_IN_USE',
  NotFound = 'WST_CTG_ERR_NOT_FOUND',
}
