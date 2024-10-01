import { Static, Type } from '@sinclair/typebox';

import { ServerConfigSchema } from './server';

export const GlobalConfigSchema = Type.Object({
  server: ServerConfigSchema,
});

export type GlobalConfig = Static<typeof GlobalConfigSchema>;
