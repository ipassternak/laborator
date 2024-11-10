import * as path from 'node:path';
import autoload from '@fastify/autoload';
import fp from 'fastify-plugin';
import { Categories } from './outgoings/domain/category';
import { Records } from './outgoings/domain/record';

declare module 'fastify' {
  interface FastifyInstance {
    outgoings: {
      categories: Categories;
      records: Records;
    };
  }
}

const plugin: AppPlugin = async (app, options) => {
  const categories = new Categories(
    app.database.category,
  );
  const records = new Records(
    app.database.record,
    categories,
    app.users,
    app.currencies,
  );

  app.decorate('outgoings', {
    categories,
    records,
  });

  await app.register(autoload, {
    dir: path.join(__dirname, 'outgoings', 'routes'),
    options,
  });
};

export default fp(plugin, {
  name: 'outgoings',
  dependencies: ['users', 'currencies'],
});
