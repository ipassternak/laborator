import closeWithGrace from 'close-with-grace';
import { build } from './app';
import { ConfigSchema } from './lib/configs';
import { config } from './lib/core/env';
import { fatal } from './lib/core/log';

async function bootstrap() {
  const cfg = config(ConfigSchema);

  const app = await build(cfg, {
    trustProxy: cfg.server.trustProxy,
    logger: {
      level: cfg.server.logger.level,
      serializers: {
        req(req) {
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
  });

  await app.listen({
    host: cfg.server.host,
    port: cfg.server.port,
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

bootstrap().catch(fatal);
