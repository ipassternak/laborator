import { Type } from '@sinclair/typebox';
import {
  CreateUserDataSchema,
  ErrUserNameAlreadyInUseSchema,
  ErrUserNotFoundSchema,
  ListUsersQuerySchema,
  UpdateUserDataSchema,
  UserDataSchema,
  UserParamsSchema,
  UsersDatasetSchema,
} from '../schemas/user';

const plugin: AppPlugin = async (app) => {
  app.get('/users', {
    schema: {
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      summary: 'Get a list of users',
      querystring: ListUsersQuerySchema,
      response: {
        200: UsersDatasetSchema,
      },
    },
    config: {
      secure: true,
    },
  }, async ({ query }) => await app.users.list(query));

  app.get('/user/:id', {
    schema: {
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      summary: 'Get a user by id',
      params: UserParamsSchema,
      response: {
        200: UserDataSchema,
        404: ErrUserNotFoundSchema,
      },
    },
    config: {
      secure: true,
    },
  }, async ({ params: { id } }) => await app.users.get(id));

  app.post('/user', {
    schema: {
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      summary: 'Create a new user',
      body: CreateUserDataSchema,
      response: {
        201: UserDataSchema,
        409: ErrUserNameAlreadyInUseSchema,
      },
    },
    config: {
      secure: true,
    },
  }, async ({ body }, reply) => {
    const res = await app.users.create(body);

    reply.code(201).send(res);
  });

  app.patch('/user/:id', {
    schema: {
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      summary: 'Update user name by id',
      params: UserParamsSchema,
      body: UpdateUserDataSchema,
      response: {
        200: UserDataSchema,
        404: ErrUserNotFoundSchema,
        409: ErrUserNameAlreadyInUseSchema,
      },
    },
    config: {
      secure: true,
    },
  }, async ({ params: { id }, body }) => await app.users.update(id, body));

  app.delete('/user/:id', {
    schema: {
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      summary: 'Delete a user by id',
      params: UserParamsSchema,
      response: {
        200: Type.Object({
          success: Type.Boolean(),
        }),
        404: ErrUserNotFoundSchema,
      },
    },
    config: {
      secure: true,
    },
  }, async ({ params: { id } }) => await app.users.delete(id));
};

export default plugin;

export const prefixOverride = '/';
