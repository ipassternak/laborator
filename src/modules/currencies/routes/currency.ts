import { Type } from '@sinclair/typebox';
import {
  CreateCurrencyDataSchema,
  CurrencyDataSchema,
  CurrencyDatasetSchema,
  CurrencyParamsSchema,
  ErrCurrencyAlreadyExistsSchema,
  ErrCurrencyInUseSchema,
  ErrCurrencyNotFoundSchema,
  ListCurrenciesQuerySchema,
} from '../schemas/currency';

const plugin: AppPlugin = async (app) => {
  app.post('', {
    schema: {
      tags: ['Currencies'],
      summary: 'Create a new currency',
      body: CreateCurrencyDataSchema,
      response: {
        201: CurrencyDataSchema,
        409: ErrCurrencyAlreadyExistsSchema,
      },
    },
  }, async ({ body }, reply) => {
    const currency = await app.currencies.create(body);

    reply.code(201).send(currency);
  });

  app.get('/:id', {
    schema: {
      tags: ['Currencies'],
      summary: 'Get a currency by id',
      params: CurrencyParamsSchema,
      response: {
        200: CurrencyDataSchema,
        404: ErrCurrencyNotFoundSchema,
      },
    },
  }, async ({ params: { id } }) => await app.currencies.get(id));

  app.get('', {
    schema: {
      tags: ['Currencies'],
      summary: 'List all currencies',
      querystring: ListCurrenciesQuerySchema,
      response: {
        200: CurrencyDatasetSchema,
      },
    },
  }, async ({ query }) => await app.currencies.list(query));

  app.delete('/:id', {
    schema: {
      tags: ['Currencies'],
      summary: 'Delete a currency by id',
      params: CurrencyParamsSchema,
      response: {
        200: Type.Object({
          success: Type.Boolean(),
        }),
        400: ErrCurrencyInUseSchema,
        404: ErrCurrencyNotFoundSchema,
      },
    },
  }, async ({ params: { id } }) => await app.currencies.delete(id));
};

export default plugin;

export const prefixOverride = '/currency';
