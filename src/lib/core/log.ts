import pino from 'pino';

const fatal = (err: unknown): never => {
  pino().fatal(err);

  process.exit(1);
};

export default {
  fatal,
};
