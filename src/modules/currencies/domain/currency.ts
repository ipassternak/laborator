import createError from '@fastify/error';
import { Prisma } from '@prisma/client';
import {
  CreateCurrencyData,
  CurrencyData,
  CurrencyDataset,
  ListCurrenciesQuery,
} from '../schemas/currency';
import { CurrencyErrorCode } from '../types/currency';

export const ErrCurrencyAlreadyExists = createError(
  CurrencyErrorCode.AlreadyExists,
  'Currency already exists',
  409,
);

export const ErrCurrencyNotFound = createError(
  CurrencyErrorCode.NotFound,
  'Currency not found',
  404,
);

export const ErrCurrencyInUse = createError(
  CurrencyErrorCode.InUse,
  'Currency is in use',
  400,
);

export class Currencies {
  constructor(
    private readonly currencyRepository: Prisma.CurrencyDelegate,
  ) {}

  private async exists(name: string, code: string) {
    const currency = await this.currencyRepository.findFirst({
      where: {
        OR: [
          {
            name,
          },
          {
            code,
          },
        ],
      },
    });

    return !!currency;
  }

  async create(data: CreateCurrencyData): Promise<CurrencyData> {
    const { name, code, symbol } = data;

    const exists = await this.exists(name, code);

    if (exists) throw new ErrCurrencyAlreadyExists();

    const currency = await this.currencyRepository.create({
      data: {
        name,
        code,
        symbol,
      },
    });

    return {
      data: currency,
    };
  }

  async get(id: string): Promise<CurrencyData> {
    const currency = await this.currencyRepository.findUnique({
      where: {
        id,
      },
    });

    if (!currency) throw new ErrCurrencyNotFound();

    return {
      data: currency,
    };
  }

  async list(query: ListCurrenciesQuery): Promise<CurrencyDataset> {
    const { page, pageSize, name, code } = query;

    const where: Prisma.CurrencyWhereInput = {
      name: {
        contains: name,
        mode: 'insensitive',
      },
      code,
    };

    const [currencies, total] = await Promise.all([
      this.currencyRepository.findMany({
        where,
        orderBy: {
          name: 'asc',
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.currencyRepository.count({ where }),
    ]);

    return {
      data: currencies,
      total,
    };
  }

  async delete(id: string) {
    await this.currencyRepository.delete({
      where: {
        id,
      },
    }).catch((err: unknown) => {
      const FK_VIOLATED_ERR_CODE = 'P2003';
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === FK_VIOLATED_ERR_CODE
      ) throw new ErrCurrencyInUse();

      throw new ErrCurrencyNotFound();
    });

    return {
      success: true,
    };
  }
}
