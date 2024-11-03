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
      summary: 'Get a list of records',
      querystring: ListRecordsQuerySchema,
      response: {
        200: RecordsDatasetSchema,
      },
    },
  }, async ({ query }) => app.outgoings.records.list(query));

  app.get('/:id', {
    schema: {
      tags: ['Records'],
      summary: 'Get a record by id',
      params: RecordParamsSchema,
      response: {
        200: RecordDataSchema,
        404: ErrRecordNotFoundSchema,
      },
    },
  }, async ({ params: { id } }) => app.outgoings.records.get(id));

  app.post('', {
    schema: {
      tags: ['Records'],
      summary: 'Create a new record',
      body: CreateRecordDataSchema,
      response: {
        201: RecordDataSchema,
      },
    },
  }, async ({ body }, reply) => {
    const res = app.outgoings.records.create(body);

    reply.code(201).send(res);
  });

  app.put('/:id', {
    schema: {
      tags: ['Records'],
      summary: 'Update record by id',
      params: RecordParamsSchema,
      body: UpdateRecordDataSchema,
      response: {
        200: RecordDataSchema,
        404: ErrRecordNotFoundSchema,
      },
    },
  }, async ({ params: { id }, body }) =>
    app.outgoings.records.update(id, body),
  );

  app.delete('/:id', {
    schema: {
      tags: ['Records'],
      summary: 'Delete a record by id',
      params: RecordParamsSchema,
      response: {
        200: Type.Object({
          success: Type.Boolean(),
        }),
        404: ErrRecordNotFoundSchema,
      },
    },
  }, async ({ params: { id } }) => app.outgoings.records.delete(id));
};

export default plugin;

export const prefixOverride = '/record';
