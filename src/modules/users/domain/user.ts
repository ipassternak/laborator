import { createError } from '@fastify/error';
import { Prisma, User } from '@prisma/client';
import {
  CreateUserData,
  ListUsersQuery,
  UpdateUserData,
  UserData,
  UsersDataset,
} from '../schemas/user';
import { UserErrorCode } from '../types/user';

export const ErrUserNotFound = createError(
  UserErrorCode.NotFound,
  'User not found',
  404,
);

export const ErrUserNameAlreadyInUse = createError(
  UserErrorCode.NameAlreadyInUse,
  'User name already in use',
  409,
);

export class Users {
  private readonly mappers = {
    toData: (user: User) => ({
      id: user.id,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }),
  };

  constructor(
    private readonly userRepository: Prisma.UserDelegate,
  ) {}

  private async exists(name: string) {
    const user = await this.userRepository.findUnique({
      where: { name },
    });

    return !!user;
  }

  private async find(id: string) {
    const user = await this.userRepository.findUnique({
      where: { id },
    });

    if (!user) throw new ErrUserNotFound();

    return user;
  }

  async create(data: CreateUserData): Promise<UserData> {
    const { name } = data;

    const nameIsUsed = await this.exists(name);

    if (nameIsUsed) throw new ErrUserNameAlreadyInUse();

    const user = await this.userRepository.create({
      data: {
        name,
      },
    });

    return {
      data: this.mappers.toData(user),
    };
  }

  async list(query: ListUsersQuery): Promise<UsersDataset> {
    const { page, pageSize, name } = query;

    const where = {
      name: {
        contains: name,
      },
    };

    const [users, total] = await Promise.all([
      this.userRepository.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.userRepository.count({
        where,
      }),
    ]);

    return {
      data: users.map(this.mappers.toData),
      total,
    };
  }

  async get(id: string): Promise<UserData> {
    const user = await this.find(id);

    return {
      data: this.mappers.toData(user),
    };
  }

  async update(id: string, data: UpdateUserData): Promise<UserData> {
    const { name } = data;

    const nameIsUsed = await this.exists(name);

    if (nameIsUsed) throw new ErrUserNameAlreadyInUse();

    const user = await this.userRepository.update({
      where: { id },
      data: {
        name,
      },
    }).catch(() => {
      throw new ErrUserNotFound();
    });

    return {
      data: this.mappers.toData(user),
    };
  }

  async delete(id: string) {
    await this.userRepository.delete({
      where: { id },
    }).catch(() => {
      throw new ErrUserNotFound();
    });

    return {
      success: true,
    };
  }
}
