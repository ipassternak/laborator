import * as path from 'node:path';
import autoload from '@fastify/autoload';
import fastify, { FastifyServerOptions } from 'fastify';
import pkg from '../package.json';

export async function build(
  config: AppConfig,
  options?: FastifyServerOptions,
) {
  const app = fastify(options);

  await app.register(autoload, {
    dir: path.join(__dirname, 'plugins'),
    encapsulate: false,
    options: { config, pkg },
  });

  await app.register(autoload, {
    dir: path.join(__dirname, 'modules'),
    ignorePattern: /^.*(?<!\.ts)(?<!\.js)(?<!\.mts)(?<!\.mjs)$/,
    maxDepth: 1,
    encapsulate: false,
    options: { config, pkg },
  });

  return await app;
}
