import createError from '@fastify/error';
import { Category, Currency, Prisma, Record } from '@prisma/client';
import {
  CreateRecordData,
  ListRecordsQuery,
  RecordData,
  RecordsDataset,
  UpdateRecordData,
} from '../schemas/record';
import {
  CategoriesIface,
  CurrenciesIface,
  RecordErrorCode,
  UsersIface,
} from '../types/record';

const ErrRecordNotFound = createError(
  RecordErrorCode.NotFound,
  'Record not found',
  404,
);

export class Records {
  private readonly mappers = {
    toData: (record: Record & {
      category: Category | null,
      currency: Currency
    }) => ({
      id: record.id,
      userId: record.userId,
      categoryId: record.categoryId,
      category: record.category && {
        name: record.category.name,
      },
      currencyId: record.currencyId,
      currency: {
        symbol: record.currency.symbol,
      },
      amount: record.amount,
      description: record.description,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    }),
  };

  constructor(
    private readonly recordRepository: Prisma.RecordDelegate,
    private readonly categories: CategoriesIface,
    private readonly users: UsersIface,
    private readonly currencies: CurrenciesIface,
  ) {}

  private async find(id: string) {
    const record = await this.recordRepository.findUnique({
      where: { id },
      include: {
        category: true,
        currency: true,
      },
    });

    if (!record) throw new ErrRecordNotFound();

    return record;
  }

  async create(data: CreateRecordData): Promise<RecordData> {
    const { categoryId, userId, currencyId, amount, description } = data;

    const { data: user } = await this.users.get(userId);
    let ctgId: string | null = null;
    if (categoryId) {
      const { data: category } = await this.categories.get(categoryId);
      ctgId = category.id;
    }
    let crnId = user.defaultCurrencyId;
    if (currencyId) {
      const { data: currency } = await this.currencies.get(currencyId);
      crnId = currency.id;
    }

    const record = await this.recordRepository.create({
      data: {
        userId: user.id,
        categoryId: ctgId,
        currencyId: crnId,
        amount,
        description,
      },
      include: {
        category: true,
        currency: true,
      },
    });

    return {
      data: this.mappers.toData(record),
    };
  }

  async get(id: string): Promise<RecordData> {
    const record = await this.find(id);

    return {
      data: this.mappers.toData(record),
    };
  }

  async list(query: ListRecordsQuery): Promise<RecordsDataset> {
    const {
      page,
      pageSize,
      userId,
      categoryId,
      currencyId,
      description,
      amountFrom,
      amountTo,
      createdAtFrom,
      createdAtTo,
    } = query;

    const where: Prisma.RecordWhereInput = {
      userId,
      categoryId,
      currencyId,
      description: {
        contains: description,
        mode: 'insensitive',
      },
      amount: {
        gte: amountFrom,
        lte: amountTo,
      },
      createdAt: {
        gte: createdAtFrom,
        lte: createdAtTo,
      },
    };

    const [records, total] = await Promise.all([
      this.recordRepository.findMany({
        where,
        orderBy: {
          createdAt: 'asc',
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          category: true,
          currency: true,
        },
      }),
      this.recordRepository.count({ where }),
    ]);

    return {
      data: records.map(this.mappers.toData),
      total,
    };
  }

  async update(id: string, data: UpdateRecordData): Promise<RecordData> {
    let categoryId = data.categoryId;
    if (categoryId) {
      const { data: category } = await this.categories.get(categoryId);
      categoryId = category.id;
    }
    const record = await this.recordRepository.update({
      where: { id },
      data: {
        ...data,
        categoryId,
      },
      include: {
        category: true,
        currency: true,
      },
    }).catch(() => {
      throw new ErrRecordNotFound();
    });

    return {
      data: this.mappers.toData(record),
    };
  }

  async delete(id: string) {
    await this.recordRepository.delete({
      where: { id },
    }).catch(() => {
      throw new ErrRecordNotFound();
    });

    return {
      success: true,
    };
  }
}
