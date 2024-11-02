import * as path from 'node:path';
import autoload from '@fastify/autoload';
import { Categories } from './domain/category';
import { Records } from './domain/record';

declare module 'fastify' {
  interface FastifyInstance {
    wastings: {
      categories: Categories;
      records: Records;
    };
  }
}

const plugin: AppPlugin = async (app, options) => {
  const categories = new Categories();
  const records = new Records(categories, app.users);

  app.decorate('wastings', {
    categories,
    records,
  });

  await app.register(autoload, {
    dir: path.join(__dirname, 'routes'),
    options,
  });
};

export default plugin;
