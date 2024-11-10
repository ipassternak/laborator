import { createError } from '@fastify/error';
import { Category, Prisma } from '@prisma/client';
import {
  CategoriesDataset,
  CategoryData,
  CreateCategoryData,
  ListCategoriesQuery,
  UpdateCategoryData,
} from '../schemas/category';
import { CategoryErrorCode } from '../types/category';

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
  private readonly mappers = {
    toData: (category: Category) => ({
      id: category.id,
      name: category.name,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    }),
  };

  constructor(
    private readonly categoryRepository: Prisma.CategoryDelegate,
  ) {}

  private async exists(name: string) {
    const category = await this.categoryRepository.findUnique({
      where: { name },
    });

    return !!category;
  }

  private async find(id: string) {
    const category = await this.categoryRepository.findUnique({
      where: { id },
    });

    if (!category) throw new ErrNotFound();

    return category;
  }

  async create(data: CreateCategoryData): Promise<CategoryData> {
    const { name } = data;

    const nameIsUsed = await this.exists(name);

    if (nameIsUsed) throw new ErrNameAlreadyInUse();

    const category = await this.categoryRepository.create({
      data: {
        name,
      },
    });

    return {
      data: this.mappers.toData(category),
    };
  }

  async list(query: ListCategoriesQuery): Promise<CategoriesDataset> {
    const { page, pageSize, name } = query;

    const where = {
      name: {
        contains: name,
      },
    };

    const [categories, total] = await Promise.all([
      this.categoryRepository.findMany({
        where,
        orderBy: {
          name: 'asc',
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.categoryRepository.count({ where }),
    ]);

    return {
      data: categories.map(this.mappers.toData),
      total,
    };
  }

  async get(id: string): Promise<CategoryData> {
    const category = await this.find(id);

    return {
      data: this.mappers.toData(category),
    };
  }

  async update(id: string, data: UpdateCategoryData): Promise<CategoryData> {
    const { name } = data;

    const nameIsUsed = await this.exists(name);

    if (nameIsUsed) throw new ErrNameAlreadyInUse();

    const category = await this.categoryRepository.update({
      where: { id },
      data: {
        name,
      },
    }).catch(() => {
      throw new ErrNotFound();
    });

    return {
      data: this.mappers.toData(category),
    };
  }

  async delete(id: string) {
    await this.categoryRepository.delete({
      where: { id },
    }).catch(() => {
      throw new ErrNotFound();
    });

    return {
      success: true,
    };
  }
}
