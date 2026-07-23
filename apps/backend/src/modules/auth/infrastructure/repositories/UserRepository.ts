/**
 * User Repository Implementation
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/database/PrismaService';
import { IUserRepository } from '../../domain/IUserRepository';
import { User } from '../../domain/User';
import { Result } from '@shared/domain/Result';
import { UniqueEntityID } from '@shared/domain/UniqueEntityID';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string, tenantId: string): Promise<Result<User>> {
    try {
      const raw = await this.prisma.user.findUnique({
        where: {
          tenantId_email: {
            tenantId,
            email,
          },
        },
      });

      if (!raw) {
        return Result.fail<User>('Usuário não encontrado');
      }

      const user = User.create(
        {
          email: raw.email,
          firstName: raw.firstName,
          lastName: raw.lastName,
          passwordHash: raw.password,
          role: raw.role as any,
          status: raw.status as any,
          tenantId: raw.tenantId,
          emailVerified: !!raw.emailVerified,
          lastLogin: raw.lastLogin || undefined,
        },
        new UniqueEntityID(raw.id)
      );

      return Result.ok<User>(user);
    } catch (error) {
      return Result.fail<User>('Erro ao buscar usuário');
    }
  }

  async findByEmailOnly(email: string): Promise<Result<User>> {
    try {
      const raw = await this.prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (!raw) {
        return Result.fail<User>('Usuário não encontrado');
      }

      const user = User.create(
        {
          email: raw.email,
          firstName: raw.firstName,
          lastName: raw.lastName,
          passwordHash: raw.password,
          role: raw.role as any,
          status: raw.status as any,
          tenantId: raw.tenantId,
          emailVerified: !!raw.emailVerified,
          lastLogin: raw.lastLogin || undefined,
        },
        new UniqueEntityID(raw.id)
      );

      return Result.ok<User>(user);
    } catch (error) {
      return Result.fail<User>('Erro ao buscar usuário');
    }
  }

  async findById(id: string, tenantId: string): Promise<Result<User>> {
    try {
      const raw = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!raw || raw.tenantId !== tenantId) {
        return Result.fail<User>('Usuário não encontrado');
      }

      const user = User.create(
        {
          email: raw.email,
          firstName: raw.firstName,
          lastName: raw.lastName,
          passwordHash: raw.password,
          role: raw.role as any,
          status: raw.status as any,
          tenantId: raw.tenantId,
        },
        new UniqueEntityID(raw.id)
      );

      return Result.ok<User>(user);
    } catch (error) {
      return Result.fail<User>('Erro ao buscar usuário');
    }
  }

  async create(user: User): Promise<Result<User>> {
    try {
      const raw = await this.prisma.user.create({
        data: {
          id: user.id.getValue,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          password: user.passwordHash,
          role: user.role,
          status: user.status,
          tenantId: user.tenantId,
        },
      });

      return Result.ok<User>(user);
    } catch (error) {
      return Result.fail<User>('Erro ao criar usuário');
    }
  }

  async update(user: User): Promise<Result<void>> {
    try {
      await this.prisma.user.update({
        where: { id: user.id.getValue },
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          lastLogin: user.lastLogin,
        },
      });

      return Result.ok<void>();
    } catch (error) {
      return Result.fail<void>('Erro ao atualizar usuário');
    }
  }

  async delete(id: string, tenantId: string): Promise<Result<void>> {
    try {
      await this.prisma.user.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });

      return Result.ok<void>();
    } catch (error) {
      return Result.fail<void>('Erro ao deletar usuário');
    }
  }
}
