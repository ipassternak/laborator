import pino from 'pino';

export function fatal(err: unknown) {
  pino().fatal(err);

  process.exit(1);
};
