import { randomUUID } from 'node:crypto';
import createError from '@fastify/error';
import {
  CreateRecordData,
  ListRecordsQuery,
  RecordData,
  RecordsDataset,
  UpdateRecordData,
} from '../schemas/record';
import {
  CategoriesIface,
  Record,
  RecordErrorCode,
  UsersIface,
} from '../types/record';

const ErrRecordNotFound = createError(
  RecordErrorCode.NotFound,
  'Record not found',
  404,
);

export class Records {
  private readonly storage = new Map<string, Record>();
  private readonly mappers = {
    toData: (record: Record) => ({
      id: record.id,
      userId: record.userId,
      categoryId: record.categoryId,
      amount: record.amount,
      description: record.description,
      createdAt: record.createdAt.toISOString(),
    }),
  };

  constructor(
    private readonly categories: CategoriesIface,
    private readonly users: UsersIface,
  ) {}

  private find(id: string) {
    const record = this.storage.get(id);

    if (!record) throw new ErrRecordNotFound();

    return record;
  }

  create(data: CreateRecordData): RecordData {
    const { categoryId, userId, amount, description } = data;

    const { data: user } = this.users.get(userId);
    const { data: category } = this.categories.get(categoryId);

    const id = randomUUID();

    const record: Record = {
      id,
      userId: user.id,
      categoryId: category.id,
      amount,
      description,
      createdAt: new Date(),
    };

    this.storage.set(id, record);

    return {
      data: this.mappers.toData(record),
    };
  }

  get(id: string): RecordData {
    const record = this.find(id);

    return {
      data: this.mappers.toData(record),
    };
  }

  list(query: ListRecordsQuery): RecordsDataset {
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

    let records = [...this.storage.values()];

    if (categoryId)
      records = records.filter((record) => record.categoryId === categoryId);

    if (userId)
      records = records.filter((record) => record.userId === userId);

    if (description) records = records
      .filter((record) => record.description?.includes(description));

    if (amountFrom)
      records = records.filter((record) => record.amount >= amountFrom);

    if (amountTo)
      records = records.filter((record) => record.amount <= amountTo);

    if (createdAtFrom) records = records.filter(
      (record) => record.createdAt >= new Date(createdAtFrom),
    );

    if (createdAtTo) records = records.filter(
      (record) => record.createdAt <= new Date(createdAtTo),
    );

    const total = records.length;

    records.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    records = records.slice((page - 1) * pageSize, page * pageSize);

    return {
      data: records.map(this.mappers.toData),
      total,
    };
  }

  update(id: string, data: UpdateRecordData): RecordData {
    let record = this.find(id);

    record = {
      ...record,
      ...data,
    };

    this.storage.set(id, record);

    return {
      data: this.mappers.toData(record),
    };
  }

  delete(id: string) {
    this.find(id);

    const success = this.storage.delete(id);

    return {
      success,
    };
  }
}
