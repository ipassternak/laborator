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
      summary: 'Get a list of users',
      querystring: ListUsersQuerySchema,
      response: {
        200: UsersDatasetSchema,
      },
    },
  }, async ({ query }) => app.users.list(query));

  app.get('/user/:id', {
    schema: {
      tags: ['Users'],
      summary: 'Get a user by id',
      params: UserParamsSchema,
      response: {
        200: UserDataSchema,
        404: ErrUserNotFoundSchema,
      },
    },
  }, async ({ params: { id } }) => app.users.get(id));

  app.post('/user', {
    schema: {
      tags: ['Users'],
      summary: 'Create a new user',
      body: CreateUserDataSchema,
      response: {
        201: UserDataSchema,
        409: ErrUserNameAlreadyInUseSchema,
      },
    },
  }, async ({ body }, reply) => {
    const res = app.users.create(body);

    reply.code(201).send(res);
  });

  app.patch('/user/:id', {
    schema: {
      tags: ['Users'],
      summary: 'Update user name by id',
      params: UserParamsSchema,
      body: UpdateUserDataSchema,
      response: {
        200: UserDataSchema,
        404: ErrUserNotFoundSchema,
        409: ErrUserNameAlreadyInUseSchema,
      },
    },
  }, async ({ params: { id }, body }) => app.users.update(id, body));

  app.delete('/user/:id', {
    schema: {
      tags: ['Users'],
      summary: 'Delete a user by id',
      params: UserParamsSchema,
      response: {
        200: Type.Object({
          success: Type.Boolean(),
        }),
        404: ErrUserNotFoundSchema,
      },
    },
  }, async ({ params: { id } }) => app.users.delete(id));
};

export default plugin;
