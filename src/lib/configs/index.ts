import { Static, Type } from '@sinclair/typebox';
import { ServerConfigSchema } from './server';

export const ConfigSchema = Type.Object({
  server: ServerConfigSchema,
});

export type Config = Static<typeof ConfigSchema>;
