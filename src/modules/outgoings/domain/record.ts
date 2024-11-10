import createError from '@fastify/error';
import { Category, Prisma, Record } from '@prisma/client';
import {
  CreateRecordData,
  ListRecordsQuery,
  RecordData,
  RecordsDataset,
  UpdateRecordData,
} from '../schemas/record';
import {
  CategoriesIface,
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
    toData: (record: Record & { category: Category | null }) => ({
      id: record.id,
      userId: record.userId,
      categoryId: record.categoryId,
      category: record.category && {
        name: record.category.name,
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
  ) {}

  private async find(id: string) {
    const record = await this.recordRepository.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!record) throw new ErrRecordNotFound();

    return record;
  }

  async create(data: CreateRecordData): Promise<RecordData> {
    const { categoryId, userId, amount, description } = data;

    const { data: user } = await this.users.get(userId);
    let ctgId: string | null = null;
    if (categoryId) {
      const { data: category } = await this.categories.get(categoryId);
      ctgId = category.id;
    }

    const record = await this.recordRepository.create({
      data: {
        userId: user.id,
        categoryId: ctgId,
        amount,
        description,
      },
      include: { category: true },
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
      description,
      amountFrom,
      amountTo,
      createdAtFrom,
      createdAtTo,
    } = query;

    const where = {
      userId,
      categoryId,
      description: {
        contains: description,
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
        include: { category: true },
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
      include: { category: true },
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
