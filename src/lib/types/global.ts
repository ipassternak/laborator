import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import {
  FastifyPluginAsync,
  RawServerDefault,
} from 'fastify';
import { Config } from '../configs';

export interface PluginOptions {
  config: Config;
  pkg: typeof import('../../../package.json');
}

export type Plugin = FastifyPluginAsync<
  PluginOptions,
  RawServerDefault,
  TypeBoxTypeProvider
>;

declare global {
  type AppPlugin = Plugin;
  type AppPluginOptions = PluginOptions;
  type AppConfig = Config;
}
