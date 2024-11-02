import * as path from 'node:path';
import autoload from '@fastify/autoload';
import { Users } from './domain/user';

declare module 'fastify' {
  interface FastifyInstance {
    users: Users;
  }
}

const plugin: AppPlugin = async (app, options) => {
  app.decorate('users', new Users());

  await app.register(autoload, {
    dir: path.join(__dirname, 'routes'),
    options,
  });
};

export default plugin;
