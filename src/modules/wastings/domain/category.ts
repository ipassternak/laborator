import { randomUUID } from 'node:crypto';
import { createError } from '@fastify/error';
import {
  CategoriesDataset,
  CategoryData,
  CreateCategoryData,
  ListCategoriesQuery,
  UpdateCategoryData,
} from '../schemas/category';
import { Category, CategoryErrorCode } from '../types/category';

export const ErrNotFound = createError(
  CategoryErrorCode.NotFound,
  'Category not found',
  404,
);

export const ErrNameAlreadyInUse = createError(
  CategoryErrorCode.NameAlreadyInUse,
  'Category name already in use',
  409,
);

export class Categories {
  private readonly storage = new Map<string, Category>();
  private readonly usedNames = new Set<string>();

  constructor() {
    this.storage = new Map();
    this.usedNames = new Set();
  }

  private exists(name: string) {
    return this.usedNames.has(name);
  }

  private find(id: string) {
    const category = this.storage.get(id);

    if (!category) throw new ErrNotFound();

    return category;
  }

  create(data: CreateCategoryData): CategoryData {
    const { name } = data;

    const nameIsUsed = this.exists(name);

    if (nameIsUsed) throw new ErrNameAlreadyInUse();

    const id = randomUUID();

    const category: Category = {
      id,
      name,
    };

    this.storage.set(id, category);
    this.usedNames.add(name);

    return {
      data: category,
    };
  }

  list(query: ListCategoriesQuery): CategoriesDataset {
    const { page, pageSize, name } = query;

    let categories = [...this.storage.values()];

    if (name) categories = categories
      .filter((category) => category.name.includes(name));

    const total = categories.length;

    categories.sort((a, b) => a.name.localeCompare(b.name));
    categories = categories.slice((page - 1) * pageSize, page * pageSize);

    return {
      data: categories,
      total,
    };
  }

  get(id: string): CategoryData {
    const category = this.find(id);

    return {
      data: category,
    };
  }

  update(id: string, data: UpdateCategoryData): CategoryData {
    const { name } = data;

    let category = this.find(id);

    if (name === category.name) return {
      data: category,
    };

    const nameIsUsed = this.exists(name);

    if (nameIsUsed) throw new ErrNameAlreadyInUse();

    category = { ...category, name };

    this.storage.set(id, category);
    this.usedNames.delete(category.name);
    this.usedNames.add(name);

    return {
      data: category,
    };
  }

  delete(id: string) {
    const category = this.find(id);

    this.usedNames.delete(category.name);
    const success = this.storage.delete(id);

    return {
      success,
    };
  }
}
