import { Static, Type } from '@sinclair/typebox';
import { UserErrorCode } from '../types/user';

export const UserParamsSchema = Type.Object({
  id: Type.String(),
});

export const CreateUserDataSchema = Type.Object({
  name: Type.String({ minLength: 3, maxLength: 32 }),
  defaultCurrencyId: Type.String({ minLength: 1 }),
});

export type CreateUserData = Static<typeof CreateUserDataSchema>;

export const UpdateUserDataSchema = CreateUserDataSchema;

export type UpdateUserData = Static<typeof UpdateUserDataSchema>;

export const ListUsersQuerySchema = Type.Object({
  page: Type.Integer({ minimum: 1, default: 1 }),
  pageSize: Type.Integer({
    minimum: 1,
    maximum: 100,
    default: 10,
  }),
  name: Type.Optional(
    Type.String({
      minLength: 3,
      description: 'Search by user name',
    }),
  ),
});

export type ListUsersQuery = Static<typeof ListUsersQuerySchema>;

const UserSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  defaultCurrencyId: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
});

export const UserDataSchema = Type.Object({
  data: UserSchema,
});

export type UserData = Static<typeof UserDataSchema>;

export const UsersDatasetSchema = Type.Object({
  data: Type.Array(UserSchema),
  total: Type.Integer(),
});

export type UsersDataset = Static<typeof UsersDatasetSchema>;

export const ErrUserNotFoundSchema = Type.Object({
  statusCode: Type.Literal(404),
  code: Type.Literal(UserErrorCode.NotFound),
  message: Type.String(),
  error: Type.String(),
});

export const ErrUserNameAlreadyInUseSchema = Type.Object({
  statusCode: Type.Literal(409),
  code: Type.Literal(UserErrorCode.NameAlreadyInUse),
  message: Type.String(),
  error: Type.String(),
});
