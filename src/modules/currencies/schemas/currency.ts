import { Static, Type } from '@sinclair/typebox';
import { CurrencyErrorCode } from '../types/currency';

export const CurrencyParamsSchema = Type.Object({
  id: Type.String(),
});

export const CreateCurrencyDataSchema = Type.Object({
  name: Type.String({ minLength: 3, maxLength: 64 }),
  code: Type.String({ minLength: 3, maxLength: 3 }),
  symbol: Type.String({ minLength: 1, maxLength: 3 }),
});

export type CreateCurrencyData = Static<typeof CreateCurrencyDataSchema>;

export const ListCurrenciesQuerySchema = Type.Object({
  page: Type.Integer({ minimum: 1, default: 1 }),
  pageSize: Type.Integer({
    minimum: 1,
    maximum: 100,
    default: 10,
  }),
  name: Type.Optional(
    Type.String({
      minLength: 3,
      description: 'Search by currency name',
    }),
  ),
  code: Type.Optional(
    Type.String({
      minLength: 3,
      maxLength: 3,
    }),
  ),
});

export type ListCurrenciesQuery = Static<typeof ListCurrenciesQuerySchema>;

export const CurrencySchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  code: Type.String(),
  symbol: Type.String(),
});

export const CurrencyDataSchema = Type.Object({
  data: CurrencySchema,
});

export type CurrencyData = Static<typeof CurrencyDataSchema>;

export const CurrencyDatasetSchema = Type.Object({
  data: Type.Array(CurrencySchema),
  total: Type.Integer(),
});

export type CurrencyDataset = Static<typeof CurrencyDatasetSchema>;

export const ErrCurrencyAlreadyExistsSchema = Type.Object({
  statusCode: Type.Literal(409),
  code: Type.Literal(CurrencyErrorCode.AlreadyExists),
  message: Type.String(),
  error: Type.String(),
});

export const ErrCurrencyNotFoundSchema = Type.Object({
  statusCode: Type.Literal(404),
  code: Type.Literal(CurrencyErrorCode.NotFound),
  message: Type.String(),
  error: Type.String(),
});

export const ErrCurrencyInUseSchema = Type.Object({
  statusCode: Type.Literal(400),
  code: Type.Literal(CurrencyErrorCode.InUse),
  message: Type.String(),
  error: Type.String(),
});
