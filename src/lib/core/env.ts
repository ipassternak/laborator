import { Static, TObject, TSchema } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';
import { Value } from '@sinclair/typebox/value';

const isObject = (schema: TSchema): schema is TObject =>
  schema.type === 'object';

const init = (
  schema: TSchema,
  path = '',
): unknown => {
  if (isObject(schema)) {
    const cfg: Record<string, unknown> = {};

    const { properties } = schema;

    for (const prop in properties) {
      const nestedSchema = properties[prop];
      const pathSegment = prop.replace(/([A-Z])/g, '_$1').toUpperCase();
      const nestedPath = path ? `${path}_${pathSegment}` : pathSegment;

      const value = init(nestedSchema, nestedPath);

      cfg[prop] = value;
    }

    return cfg;
  }

  const key = <string | undefined>schema.env ?? path;
  const value = process.env[key];

  return Value.Convert(schema, Value.Default(schema, value));
};

class ConfigError extends Error {
  constructor(readonly pathes: object[]) {
    super('configuration error');
  }
}

const validate = <T extends TSchema>(
  schema: T,
  cfg: unknown,
): cfg is Static<T> => {
  const compiler = TypeCompiler.Compile(schema);

  if (compiler.Check(cfg)) return true;

  const pathes = [...compiler.Errors(cfg)]
    .map((err) => ({
      path: err.path,
      message: err.message,
    }));

  throw new ConfigError(pathes);
};

const config = <T extends TSchema>(schema: T): Static<T> => {
  const cfg = init(schema);

  validate(schema, cfg);

  return cfg;
};

export default {
  init,
  validate,
  config,
};
