import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';

async function plugin(app: FastifyInstance): Promise<void> {
  app.get('/healthcheck', async () => ({
    status: 'ready',
    date: new Date(),
  }));
}

export default fp(plugin, {
  name: 'healthcheck',
  dependencies: ['rateLimit'],
});
