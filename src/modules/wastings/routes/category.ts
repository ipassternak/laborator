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
      summary: 'Get a list of categories',
      querystring: ListCategoriesQuerySchema,
      response: {
        200: CategoriesDatasetSchema,
      },
    },
  }, async ({ query }) => app.wastings.categories.list(query));

  app.get('/:id', {
    schema: {
      tags: ['Categories'],
      summary: 'Get a category by id',
      params: CategoryParamsSchema,
      response: {
        200: CategoryDataSchema,
        404: ErrCategoryNotFoundSchema,
      },
    },
  }, async ({ params: { id } }) => app.wastings.categories.get(id));

  app.post('', {
    schema: {
      tags: ['Categories'],
      summary: 'Create a new category',
      body: CreateCategoryDataSchema,
      response: {
        201: CategoryDataSchema,
        409: ErrCategoryNameAlreadyInUseSchema,
      },
    },
  }, async ({ body }, reply) => {
    const res = app.wastings.categories.create(body);

    reply.code(201).send(res);
  });

  app.patch('/:id', {
    schema: {
      tags: ['Categories'],
      summary: 'Update category name by id',
      params: CategoryParamsSchema,
      body: UpdateCategoryDataSchema,
      response: {
        200: CategoryDataSchema,
        404: ErrCategoryNotFoundSchema,
        409: ErrCategoryNameAlreadyInUseSchema,
      },
    },
  }, async ({ params: { id }, body }) =>
    app.wastings.categories.update(id, body),
  );

  app.delete('/:id', {
    schema: {
      tags: ['Categories'],
      summary: 'Delete a category by id',
      params: CategoryParamsSchema,
      response: {
        200: Type.Object({
          success: Type.Boolean(),
        }),
        404: ErrCategoryNotFoundSchema,
      },
    },
  }, async ({ params: { id } }) => app.wastings.categories.delete(id));
};

export default plugin;

export const prefixOverride = '/category';
