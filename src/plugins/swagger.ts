import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fp from 'fastify-plugin';

const plugin: AppPlugin = async (app, opts) => {
  const { config, pkg } = opts;

  await app.register(fastifySwagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: pkg.name,
        description: pkg.description,
        version: pkg.version,
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
          },
        },
      },
      externalDocs: {
        url: pkg.homepage,
        description: 'Project GitHub repository',
      },
    },
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    logLevel: 'error',
  });

  app.log.info(`Docs available at http://localhost:${config.server.port}/docs`);
};

export default fp(plugin, {
  name: 'swagger',
});
