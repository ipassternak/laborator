import { Static, Type } from '@sinclair/typebox';
import { CategoryErrorCode } from '../types/category';

export const CategoryParamsSchema = Type.Object({
  id: Type.String(),
});

export const CreateCategoryDataSchema = Type.Object({
  name: Type.String({ minLength: 1, maxLength: 255 }),
});

export type CreateCategoryData = Static<typeof CreateCategoryDataSchema>;

export const UpdateCategoryDataSchema = CreateCategoryDataSchema;

export type UpdateCategoryData = Static<typeof UpdateCategoryDataSchema>;

export const ListCategoriesQuerySchema = Type.Object({
  page: Type.Integer({ minimum: 1, default: 1 }),
  pageSize: Type.Integer({
    minimum: 1,
    maximum: 100,
    default: 10,
  }),
  name: Type.Optional(
    Type.String({
      minLength: 3,
      description: 'Search by category name',
    }),
  ),
});

export type ListCategoriesQuery = Static<typeof ListCategoriesQuerySchema>;

const CategorySchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
});

export const CategoryDataSchema = Type.Object({
  data: CategorySchema,
});

export type CategoryData = Static<typeof CategoryDataSchema>;

export const CategoriesDatasetSchema = Type.Object({
  data: Type.Array(CategorySchema),
  total: Type.Integer(),
});

export type CategoriesDataset = Static<typeof CategoriesDatasetSchema>;

export const ErrCategoryNotFoundSchema = Type.Object({
  statusCode: Type.Literal(404),
  code: Type.Literal(CategoryErrorCode.NotFound),
  message: Type.String(),
  error: Type.String(),
});

export const ErrCategoryNameAlreadyInUseSchema = Type.Object({
  statusCode: Type.Literal(409),
  code: Type.Literal(CategoryErrorCode.NameAlreadyInUse),
  message: Type.String(),
  error: Type.String(),
});
