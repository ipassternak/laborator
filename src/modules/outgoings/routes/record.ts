import { Type } from '@sinclair/typebox';
import {
  CreateRecordDataSchema,
  ErrRecordNotFoundSchema,
  ListRecordsQuerySchema,
  RecordDataSchema,
  RecordParamsSchema,
  RecordsDatasetSchema,
  UpdateRecordDataSchema,
} from '../schemas/record';

const plugin: AppPlugin = async (app) => {
  app.get('', {
    schema: {
      tags: ['Records'],
      security: [{ bearerAuth: [] }],
      summary: 'Get a list of records',
      querystring: ListRecordsQuerySchema,
      response: {
        200: RecordsDatasetSchema,
      },
    },
    config: {
      secure: true,
    },
  }, async ({ query }) => await app.outgoings.records.list({
    ...query,
    categoryId: query.categoryId === 'null' ? null : query.categoryId,
  }));

  app.get('/:id', {
    schema: {
      tags: ['Records'],
      security: [{ bearerAuth: [] }],
      summary: 'Get a record by id',
      params: RecordParamsSchema,
      response: {
        200: RecordDataSchema,
        404: ErrRecordNotFoundSchema,
      },
    },
    config: {
      secure: true,
    },
  }, async ({ params: { id } }) => await app.outgoings.records.get(id));

  app.post('', {
    schema: {
      tags: ['Records'],
      security: [{ bearerAuth: [] }],
      summary: 'Create a new record',
      body: CreateRecordDataSchema,
      response: {
        201: RecordDataSchema,
      },
    },
    config: {
      secure: true,
    },
  }, async ({ body }, reply) => {
    const res = await app.outgoings.records.create(body);

    reply.code(201).send(res);
  });

  app.put('/:id', {
    schema: {
      tags: ['Records'],
      security: [{ bearerAuth: [] }],
      summary: 'Update record by id',
      params: RecordParamsSchema,
      body: UpdateRecordDataSchema,
      response: {
        200: RecordDataSchema,
        404: ErrRecordNotFoundSchema,
      },
    },
    config: {
      secure: true,
    },
  }, async ({ params: { id }, body }) =>
    await app.outgoings.records.update(id, body),
  );

  app.delete('/:id', {
    schema: {
      tags: ['Records'],
      security: [{ bearerAuth: [] }],
      summary: 'Delete a record by id',
      params: RecordParamsSchema,
      response: {
        200: Type.Object({
          success: Type.Boolean(),
        }),
        404: ErrRecordNotFoundSchema,
      },
    },
    config: {
      secure: true,
    },
  }, async ({ params: { id } }) => await app.outgoings.records.delete(id));
};

export default plugin;

export const prefixOverride = '/record';
