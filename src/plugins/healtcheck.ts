import { Type } from '@sinclair/typebox';
import fp from 'fastify-plugin';

const plugin: AppPlugin = async (app, options) => {
  const { config } = options;

  if (config.server.healthcheckRoute)
    app.get(config.server.healthcheckRoute, {
      schema: {
        tags: ['Healthcheck'],
        summary: 'Check the health of the servic',
        response: {
          200: Type.Object({
            status: Type.String(),
            date: Type.String({ format: 'date-time' }),
          }),
        },
      },
      logLevel: 'error',
    }, async () => ({
      status: 'ready',
      date: new Date().toISOString(),
    }));
};

export default fp(plugin, {
  name: 'healthcheck',
  dependencies: ['rateLimit', 'swagger'],
});
