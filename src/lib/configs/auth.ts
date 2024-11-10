import { Static, Type } from '@sinclair/typebox';

export const AuthConfigSchema = Type.Object({
  tokens: Type.Optional(Type.String()),
});

export type AuthConfig = Static<typeof AuthConfigSchema>;
