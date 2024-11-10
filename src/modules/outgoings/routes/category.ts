import { Type } from '@sinclair/typebox';
import {
  CategoriesDatasetSchema,
  CategoryDataSchema,
  CategoryParamsSchema,
  CreateCategoryDataSchema,
  ErrCategoryNameAlreadyInUseSchema,
  ErrCategoryNotFoundSchema,
  ListCategoriesQuerySchema,
  UpdateCategoryDataSchema,
} from '../schemas/category';

const plugin: AppPlugin = async (app) => {
  app.get('', {
    schema: {
      tags: ['Categories'],
      security: [{ bearerAuth: [] }],
      summary: 'Get a list of categories',
      querystring: ListCategoriesQuerySchema,
      response: {
        200: CategoriesDatasetSchema,
      },
    },
    config: {
      secure: true,
    },
  }, async ({ query }) => await app.outgoings.categories.list(query));

  app.get('/:id', {
    schema: {
      tags: ['Categories'],
      security: [{ bearerAuth: [] }],
      summary: 'Get a category by id',
      params: CategoryParamsSchema,
      response: {
        200: CategoryDataSchema,
        404: ErrCategoryNotFoundSchema,
      },
    },
    config: {
      secure: true,
    },
  }, async ({ params: { id } }) => await app.outgoings.categories.get(id));

  app.post('', {
    schema: {
      tags: ['Categories'],
      security: [{ bearerAuth: [] }],
      summary: 'Create a new category',
      body: CreateCategoryDataSchema,
      response: {
        201: CategoryDataSchema,
        409: ErrCategoryNameAlreadyInUseSchema,
      },
    },
    config: {
      secure: true,
    },
  }, async ({ body }, reply) => {
    const res = await app.outgoings.categories.create(body);

    reply.code(201).send(res);
  });

  app.patch('/:id', {
    schema: {
      tags: ['Categories'],
      security: [{ bearerAuth: [] }],
      summary: 'Update category name by id',
      params: CategoryParamsSchema,
      body: UpdateCategoryDataSchema,
      response: {
        200: CategoryDataSchema,
        404: ErrCategoryNotFoundSchema,
        409: ErrCategoryNameAlreadyInUseSchema,
      },
    },
    config: {
      secure: true,
    },
  }, async ({ params: { id }, body }) =>
    await app.outgoings.categories.update(id, body),
  );

  app.delete('/:id', {
    schema: {
      tags: ['Categories'],
      security: [{ bearerAuth: [] }],
      summary: 'Delete a category by id',
      params: CategoryParamsSchema,
      response: {
        200: Type.Object({
          success: Type.Boolean(),
        }),
        404: ErrCategoryNotFoundSchema,
      },
    },
    config: {
      secure: true,
    },
  }, async ({ params: { id } }) => await app.outgoings.categories.delete(id));
};

export default plugin;

export const prefixOverride = '/category';
