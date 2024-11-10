import * as path from 'node:path';
import autoload from '@fastify/autoload';
import fp from 'fastify-plugin';
import { Users } from './users/domain/user';

declare module 'fastify' {
  interface FastifyInstance {
    users: Users;
  }
}

const plugin: AppPlugin = async (app, options) => {
  app.decorate('users', new Users(
    app.database.user,
  ));

  await app.register(autoload, {
    dir: path.join(__dirname, 'users', 'routes'),
    options,
  });
};

export default fp(plugin, {
  name: 'users',
});
