import * as path from 'node:path';
import autoload from '@fastify/autoload';
import fp from 'fastify-plugin';
import { Currencies } from './currencies/domain/currency';

declare module 'fastify' {
  interface FastifyInstance {
    currencies: Currencies;
  }
}

const plugin: AppPlugin = async (app, options) => {
  app.decorate('currencies', new Currencies(
    app.database.currency,
  ));

  await app.register(autoload, {
    dir: path.join(__dirname, 'currencies', 'routes'),
    options,
  });
};

export default fp(plugin, {
  name: 'currencies',
});
