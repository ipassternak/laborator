import { Static, Type } from '@sinclair/typebox';

export const ServerConfigSchema = Type.Object({
  port: Type.Integer({
    env: 'PORT',
  }),
  host: Type.String({
    env: 'HOST',
  }),
  logger: Type.Object({
    level: Type.String({
      default: 'info',
    }),
  }),
  rateLimit: Type.Object({
    max: Type.Integer({
      default: 100,
    }),
    timeWindow: Type.Integer({
      default: 1000 * 60,
    }),
  }),
  trustProxy: Type.Boolean({
    default: false,
  }),
});

export type ServerConfig = Static<typeof ServerConfigSchema>;
