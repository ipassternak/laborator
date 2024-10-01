import fp from 'fastify-plugin';
import rateLimit from '@fastify/rate-limit';
import { FastifyInstance } from 'fastify';

import { PluginOptions } from '../lib/types/common';

async function plugin(
  app: FastifyInstance,
  { config }: PluginOptions,
): Promise<void> {
  await app.register(rateLimit, {
    max: config.server.rateLimit.max,
    timeWindow: config.server.rateLimit.timeWindow,
  });
}

export default fp(plugin, {
  name: 'rateLimit',
});
