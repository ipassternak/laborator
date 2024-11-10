import { PrismaClient } from '@prisma/client';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    database: PrismaClient;
  }
}

const plugin: AppPlugin = async (app, options) => {
  const { config } = options;

  const database = new PrismaClient({
    datasourceUrl: config.database.url,
  });

  app.decorate('database', database);

  app.addHook('onClose', async () => {
    await database.$disconnect();
  });

  await database.$connect();
};

export default fp(plugin, {
  name: 'database',
});
