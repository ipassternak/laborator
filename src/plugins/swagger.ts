import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fp from 'fastify-plugin';

const plugin: AppPlugin = async (app, options) => {
  const { config, pkg } = options;

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

  if (config.server.swaggerUiRoute)
    await app.register(fastifySwaggerUi, {
      routePrefix: config.server.swaggerUiRoute,
      logLevel: 'error',
    });
};

export default fp(plugin, {
  name: 'swagger',
});
