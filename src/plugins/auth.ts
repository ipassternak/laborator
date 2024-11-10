import bearerAuth from '@fastify/bearer-auth';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyContextConfig {
    secure?: boolean;
  }
}

const plugin: AppPlugin = async (app, options) => {
  const { config } = options;

  let keys: Set<string> | null = null;
  if (config.auth.tokens) {
    const tokens = config.auth.tokens.split(',').filter(Boolean);
    keys = new Set(tokens);
  }

  if (keys && keys.size > 0) {
    app.register(bearerAuth, {
      keys,
      addHook: false,
    });

    app.addHook('onRoute', (routeOptions) => {
      if (routeOptions.config?.secure) routeOptions.preValidation =
        [routeOptions.preValidation, app.verifyBearerAuth]
          .flat()
          .filter((hook) => typeof hook === 'function');
    });
  }
};

export default fp(plugin, {
  name: 'auth',
});
