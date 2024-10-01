import { FastifyRequest } from 'fastify';
import closeWithGrace from 'close-with-grace';

import env from './lib/core/env';
import log from './lib/core/log';
import { GlobalConfigSchema } from './lib/configs/global';
import { build } from './app';

async function bootstrap(): Promise<void> {
  const config = env.config(GlobalConfigSchema);

  const options = {
    trustProxy: config.server.trustProxy,
    logger: {
      level: config.server.logger.level,
      serializers: {
        req(req: FastifyRequest): object {
          return {
            method: req.method,
            url: req.url,
            headers: req.headers,
            hostname: req.hostname,
            remoteAddress: req.ip,
            remotePort: req.socket.remotePort,
          };
        },
      },
    },
  };

  const app = await build(config, options);

  await app.listen({
    host: config.server.host,
    port: config.server.port,
  });

  closeWithGrace(async ({ signal, err }) => {
    if (err) {
      app.log.error({ err }, 'server closing with error');
    } else {
      app.log.info({ signal }, 'server closing');
    }

    await app.close();
  });
}

bootstrap().catch(log.fatal);
