/**
 * Agent Repository Implementation
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/database/PrismaService';
import { IAgentRepository } from '../../domain/IAgentRepository';
import { Agent } from '../../domain/Agent';
import { Result } from '@shared/domain/Result';
import { UniqueEntityID } from '@shared/domain/UniqueEntityID';
import { IPaginatedResult, IPaginationOptions } from '@shared/types';

@Injectable()
export class AgentRepository implements IAgentRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string, tenantId: string): Promise<Result<Agent>> {
    try {
      const raw = await this.prisma.agent.findUnique({
        where: { id },
      });

      if (!raw || raw.tenantId !== tenantId) {
        return Result.fail<Agent>('Agente não encontrado');
      }

      const agent = this.toDomain(raw);
      return Result.ok<Agent>(agent);
    } catch (error) {
      return Result.fail<Agent>('Erro ao buscar agente');
    }
  }

  async findByUserId(userId: string, tenantId: string): Promise<Result<Agent>> {
    try {
      const raw = await this.prisma.agent.findFirst({
        where: {
          tenantId,
          userId,
        },
      });

      if (!raw) {
        return Result.fail<Agent>('Agente não encontrado');
      }

      const agent = this.toDomain(raw);
      return Result.ok<Agent>(agent);
    } catch (error) {
      return Result.fail<Agent>('Erro ao buscar agente');
    }
  }

  async create(agent: Agent): Promise<Result<Agent>> {
    try {
      await this.prisma.agent.create({
        data: {
          id: agent.id.getValue,
          tenantId: agent.tenantId,
          userId: agent.userId,
          name: agent.name,
          title: agent.props.title,
          bio: agent.props.bio,
          status: agent.status,
          isAvailable: agent.isAvailable,
          maxConcurrent: agent.props.maxConcurrent,
          specialties: agent.specialties,
          departmentId: agent.props.departmentId,
          settings: agent.props.settings,
        },
      });

      return Result.ok<Agent>(agent);
    } catch (error) {
      return Result.fail<Agent>('Erro ao criar agente');
    }
  }

  async update(agent: Agent): Promise<Result<void>> {
    try {
      await this.prisma.agent.update({
        where: { id: agent.id.getValue },
        data: {
          name: agent.name,
          title: agent.props.title,
          bio: agent.props.bio,
          status: agent.status,
          isAvailable: agent.isAvailable,
          currentConversations: agent.currentConversations,
          specialties: agent.specialties,
          departmentId: agent.props.departmentId,
          totalLeads: agent.props.totalLeads,
          totalClosed: agent.props.totalClosed,
          averageRating: agent.props.averageRating,
          responseTime: agent.props.responseTime,
          settings: agent.props.settings,
        },
      });

      return Result.ok<void>();
    } catch (error) {
      return Result.fail<void>('Erro ao atualizar agente');
    }
  }

  async delete(id: string, tenantId: string): Promise<Result<void>> {
    try {
      await this.prisma.agent.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });

      return Result.ok<void>();
    } catch (error) {
      return Result.fail<void>('Erro ao deletar agente');
    }
  }

  async findByTenant(
    tenantId: string,
    pagination?: IPaginationOptions
  ): Promise<Result<IPaginatedResult<Agent>>> {
    try {
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;
      const offset = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.prisma.agent.findMany({
          where: {
            tenantId,
            deletedAt: null,
          },
          skip: offset,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.agent.count({
          where: {
            tenantId,
            deletedAt: null,
          },
        }),
      ]);

      const agents = data.map((raw) => this.toDomain(raw));

      return Result.ok<IPaginatedResult<Agent>>({
        data: agents,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      return Result.fail<IPaginatedResult<Agent>>('Erro ao listar agentes');
    }
  }

  async findAvailableByTenant(
    tenantId: string,
    pagination?: IPaginationOptions
  ): Promise<Result<IPaginatedResult<Agent>>> {
    try {
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;
      const offset = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.prisma.agent.findMany({
          where: {
            tenantId,
            isAvailable: true,
            deletedAt: null,
          },
          skip: offset,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.agent.count({
          where: {
            tenantId,
            isAvailable: true,
            deletedAt: null,
          },
        }),
      ]);

      const agents = data.map((raw) => this.toDomain(raw));

      return Result.ok<IPaginatedResult<Agent>>({
        data: agents,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      return Result.fail<IPaginatedResult<Agent>>('Erro ao listar agentes disponíveis');
    }
  }

  async findByDepartment(
    tenantId: string,
    departmentId: string,
    pagination?: IPaginationOptions
  ): Promise<Result<IPaginatedResult<Agent>>> {
    try {
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;
      const offset = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.prisma.agent.findMany({
          where: {
            tenantId,
            departmentId,
            deletedAt: null,
          },
          skip: offset,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.agent.count({
          where: {
            tenantId,
            departmentId,
            deletedAt: null,
          },
        }),
      ]);

      const agents = data.map((raw) => this.toDomain(raw));

      return Result.ok<IPaginatedResult<Agent>>({
        data: agents,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      return Result.fail<IPaginatedResult<Agent>>('Erro ao listar agentes do departamento');
    }
  }

  private toDomain(raw: any): Agent {
    return Agent.create(
      {
        tenantId: raw.tenantId,
        userId: raw.userId,
        name: raw.name,
        title: raw.title,
        bio: raw.bio,
        status: raw.status,
        isAvailable: raw.isAvailable,
        maxConcurrent: raw.maxConcurrent,
        currentConversations: raw.currentConversations,
        specialties: raw.specialties,
        departmentId: raw.departmentId,
        totalLeads: raw.totalLeads,
        totalClosed: raw.totalClosed,
        averageRating: raw.averageRating,
        responseTime: raw.responseTime,
        settings: raw.settings,
      },
      new UniqueEntityID(raw.id)
    );
  }
}
