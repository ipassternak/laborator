import { Static, Type } from '@sinclair/typebox';
import { AuthConfigSchema } from './auth';
import { DatabaseConfigSchema } from './database';
import { ServerConfigSchema } from './server';

export const ConfigSchema = Type.Object({
  server: ServerConfigSchema,
  database: DatabaseConfigSchema,
  auth: AuthConfigSchema,
});

export type Config = Static<typeof ConfigSchema>;
