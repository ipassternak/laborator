export interface Category {
  id: string;
  name: string;
}

export enum CategoryErrorCode {
  NameAlreadyInUse = 'OTG_CTG_ERR_NAME_ALREADY_IN_USE',
  NotFound = 'OTG_CTG_ERR_NOT_FOUND',
}
