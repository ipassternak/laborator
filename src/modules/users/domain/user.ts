import { randomUUID } from 'node:crypto';
import { createError } from '@fastify/error';
import {
  CreateUserData,
  ListUsersQuery,
  UpdateUserData,
  UserData,
  UsersDataset,
} from '../schemas/user';
import { User, UserErrorCode } from '../types/user';

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
  private readonly storage = new Map<string, User>();
  private readonly usedNames = new Set<string>();
  private readonly mappers = {
    toData: (user: User) => ({
      id: user.id,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }),
  };

  private exists(name: string) {
    return this.usedNames.has(name);
  }

  private find(id: string) {
    const user = this.storage.get(id);

    if (!user) throw new ErrUserNotFound();

    return user;
  }

  create(data: CreateUserData): UserData {
    const { name } = data;

    const nameIsUsed = this.exists(name);

    if (nameIsUsed) throw new ErrUserNameAlreadyInUse();

    const id = randomUUID();

    const user: User = {
      id,
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.storage.set(id, user);
    this.usedNames.add(name);

    return {
      data: this.mappers.toData(user),
    };
  }

  list(query: ListUsersQuery): UsersDataset {
    const { page, pageSize, name } = query;

    let users = [...this.storage.values()];

    if (name) users = users.filter((user) => user.name.includes(name));

    const total = users.length;

    users.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    users = users.slice((page - 1) * pageSize, page * pageSize);

    return {
      data: users.map(this.mappers.toData),
      total,
    };
  }

  get(id: string): UserData {
    const user = this.find(id);

    return {
      data: this.mappers.toData(user),
    };
  }

  update(id: string, data: UpdateUserData): UserData {
    const { name } = data;

    let user = this.find(id);

    if (name === user.name) return {
      data: this.mappers.toData(user),
    };

    const nameIsUsed = this.exists(name);

    if (nameIsUsed) throw new ErrUserNameAlreadyInUse();

    user = { ...user, name, updatedAt: new Date() };

    this.storage.set(id, user);
    this.usedNames.delete(user.name);
    this.usedNames.add(name);

    return {
      data: this.mappers.toData(user),
    };
  }

  delete(id: string) {
    const user = this.find(id);

    this.usedNames.delete(user.name);
    const success = this.storage.delete(id);

    return {
      success,
    };
  }
}
