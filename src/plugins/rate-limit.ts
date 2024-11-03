import rateLimit from '@fastify/rate-limit';
import fp from 'fastify-plugin';

const plugin: AppPlugin = async (app, options) => {
  const { config } = options;

  await app.register(rateLimit, {
    max: config.server.rateLimit.max,
    timeWindow: config.server.rateLimit.timeWindow,
  });
};

export default fp(plugin, {
  name: 'rateLimit',
});
