import { Static, Type } from '@sinclair/typebox';

export const DatabaseConfigSchema = Type.Object({
  host: Type.String({
    minLength: 1,
  }),
  port: Type.Integer({
    minimum: 1,
    maximum: 65535,
    default: 5432,
  }),
  user: Type.String({
    minLength: 1,
  }),
  password: Type.String({
    minLength: 1,
  }),
  name: Type.String({
    minLength: 1,
  }),
  url: Type.String({
    minLength: 1,
  }),
});

export type DatabaseConfig = Static<typeof DatabaseConfigSchema>;
