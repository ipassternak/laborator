import * as path from 'node:path';

import fastify, { FastifyInstance } from 'fastify';
import autoload from '@fastify/autoload';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

import { GlobalConfig } from './lib/configs/global';

export async function build(
  config: GlobalConfig,
  options?: Record<string, unknown>,
): Promise<FastifyInstance> {
  const app = fastify(options).withTypeProvider<TypeBoxTypeProvider>();

  await app.register(autoload, {
    dir: path.join(__dirname, 'plugins'),
    encapsulate: false,
    options: { config },
  });

  // TODO: Uncomment to load app modules
  // await app.register(autoload, {
  //   dir: path.join(__dirname, 'modules'),
  //   maxDepth: 1,
  //   options: { config },
  // });

  return app;
}
