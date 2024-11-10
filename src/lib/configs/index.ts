import { Static, Type } from '@sinclair/typebox';
import { DatabaseConfigSchema } from './database';
import { ServerConfigSchema } from './server';

export const ConfigSchema = Type.Object({
  server: ServerConfigSchema,
  database: DatabaseConfigSchema,
});

export type Config = Static<typeof ConfigSchema>;
