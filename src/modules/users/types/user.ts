import { CurrencyData } from '../../currencies/schemas/currency';

export enum UserErrorCode {
  NameAlreadyInUse = 'USR_ERR_NAME_ALREADY_IN_USE',
  NotFound = 'USR_ERR_NOT_FOUND',
}

export interface CurrenciesIface {
  get(id: string): Promise<CurrencyData>;
}
