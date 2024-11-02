import { Static, Type } from '@sinclair/typebox';
import { RecordErrorCode } from '../types/record';

export const RecordParamsSchema = Type.Object({
  id: Type.String(),
});

export const ListRecordsQuerySchema = Type.Object({
  page: Type.Integer({ minimum: 1, default: 1 }),
  pageSize: Type.Integer({
    minimum: 1,
    maximum: 100,
    default: 10,
  }),
  userId: Type.Optional(Type.String()),
  categoryId: Type.Optional(Type.String()),
  description: Type.Optional(
    Type.String({
      minLength: 3,
      description: 'Search by record description',
    }),
  ),
  amountFrom: Type.Optional(Type.Number({ minimum: 0 })),
  amountTo: Type.Optional(Type.Number({ minimum: 0 })),
  createdAtFrom: Type.Optional(Type.String({ format: 'date-time' })),
  createdAtTo: Type.Optional(Type.String({ format: 'date-time' })),
});

export type ListRecordsQuery = Static<typeof ListRecordsQuerySchema>;

export const CreateRecordDataSchema = Type.Object({
  userId: Type.String(),
  categoryId: Type.String(),
  amount: Type.Number({ minimum: 0 }),
  description: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
});

export type CreateRecordData = Static<typeof CreateRecordDataSchema>;

export const UpdateRecordDataSchema = Type.Object({
  amount: Type.Optional(Type.Number({ minimum: 0 })),
  description: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
});

export type UpdateRecordData = Static<typeof UpdateRecordDataSchema>;

export const RecordSchema = Type.Object({
  id: Type.String(),
  userId: Type.String(),
  categoryId: Type.String(),
  amount: Type.Number(),
  description: Type.Optional(Type.String()),
  createdAt: Type.String({ format: 'date-time' }),
});

export const RecordDataSchema = Type.Object({
  data: RecordSchema,
});

export type RecordData = Static<typeof RecordDataSchema>;

export const RecordsDatasetSchema = Type.Object({
  data: Type.Array(RecordSchema),
  total: Type.Number(),
});

export type RecordsDataset = Static<typeof RecordsDatasetSchema>;

export const ErrRecordNotFoundSchema = Type.Object({
  statusCode: Type.Literal(404),
  code: Type.Literal(RecordErrorCode.NotFound),
  message: Type.String(),
  error: Type.String(),
});
