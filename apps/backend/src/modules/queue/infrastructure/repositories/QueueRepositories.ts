/**
 * Queue Repositories Implementation
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/database/PrismaService';
import { IQueueRepository, IQueueAssignmentRepository } from '../../domain/IQueueRepository';
import { Queue, QueueAssignment } from '../../domain/Queue';
import { Result } from '@shared/domain/Result';
import { UniqueEntityID } from '@shared/domain/UniqueEntityID';
import { IPaginatedResult, IPaginationOptions } from '@shared/types';

@Injectable()
export class QueueRepository implements IQueueRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string, tenantId: string): Promise<Result<Queue>> {
    try {
      const raw = await this.prisma.queue.findUnique({
        where: { id },
      });

      if (!raw || raw.tenantId !== tenantId) {
        return Result.fail<Queue>('Fila não encontrada');
      }

      const queue = this.toDomain(raw);
      return Result.ok<Queue>(queue);
    } catch (error) {
      return Result.fail<Queue>('Erro ao buscar fila');
    }
  }

  async findByName(name: string, tenantId: string): Promise<Result<Queue>> {
    try {
      const raw = await this.prisma.queue.findFirst({
        where: {
          tenantId,
          name,
        },
      });

      if (!raw) {
        return Result.fail<Queue>('Fila não encontrada');
      }

      const queue = this.toDomain(raw);
      return Result.ok<Queue>(queue);
    } catch (error) {
      return Result.fail<Queue>('Erro ao buscar fila');
    }
  }

  async create(queue: Queue): Promise<Result<Queue>> {
    try {
      await this.prisma.queue.create({
        data: {
          id: queue.id.getValue,
          tenantId: queue.tenantId,
          name: queue.name,
          description: queue.props.description,
          strategy: queue.strategy,
          departmentId: queue.props.departmentId,
          isActive: queue.isActive,
          maxRetries: queue.props.maxRetries,
          assignmentTimeout: queue.props.assignmentTimeout,
          settings: queue.props.settings,
        },
      });

      return Result.ok<Queue>(queue);
    } catch (error) {
      return Result.fail<Queue>('Erro ao criar fila');
    }
  }

  async update(queue: Queue): Promise<Result<void>> {
    try {
      await this.prisma.queue.update({
        where: { id: queue.id.getValue },
        data: {
          name: queue.name,
          description: queue.props.description,
          strategy: queue.strategy,
          isActive: queue.isActive,
          settings: queue.props.settings,
        },
      });

      return Result.ok<void>();
    } catch (error) {
      return Result.fail<void>('Erro ao atualizar fila');
    }
  }

  async delete(id: string, tenantId: string): Promise<Result<void>> {
    try {
      // Soft delete ou remover
      await this.prisma.queue.update({
        where: { id },
        data: {
          isActive: false,
        },
      });

      return Result.ok<void>();
    } catch (error) {
      return Result.fail<void>('Erro ao deletar fila');
    }
  }

  async findByTenant(
    tenantId: string,
    pagination?: IPaginationOptions
  ): Promise<Result<IPaginatedResult<Queue>>> {
    try {
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;
      const offset = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.prisma.queue.findMany({
          where: { tenantId },
          skip: offset,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.queue.count({ where: { tenantId } }),
      ]);

      const queues = data.map((raw) => this.toDomain(raw));

      return Result.ok<IPaginatedResult<Queue>>({
        data: queues,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      return Result.fail<IPaginatedResult<Queue>>('Erro ao listar filas');
    }
  }

  async findByDepartment(tenantId: string, departmentId: string): Promise<Result<Queue[]>> {
    try {
      const data = await this.prisma.queue.findMany({
        where: {
          tenantId,
          departmentId,
        },
      });

      const queues = data.map((raw) => this.toDomain(raw));
      return Result.ok<Queue[]>(queues);
    } catch (error) {
      return Result.fail<Queue[]>('Erro ao buscar filas do departamento');
    }
  }

  private toDomain(raw: any): Queue {
    return Queue.create(
      {
        tenantId: raw.tenantId,
        name: raw.name,
        description: raw.description,
        strategy: raw.strategy,
        departmentId: raw.departmentId,
        isActive: raw.isActive,
        maxRetries: raw.maxRetries,
        assignmentTimeout: raw.assignmentTimeout,
        settings: raw.settings,
      },
      new UniqueEntityID(raw.id)
    );
  }
}

@Injectable()
export class QueueAssignmentRepository implements IQueueAssignmentRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Result<QueueAssignment>> {
    try {
      const raw = await this.prisma.queueAssignment.findUnique({
        where: { id },
      });

      if (!raw) {
        return Result.fail<QueueAssignment>('Atribuição não encontrada');
      }

      const assignment = this.toDomain(raw);
      return Result.ok<QueueAssignment>(assignment);
    } catch (error) {
      return Result.fail<QueueAssignment>('Erro ao buscar atribuição');
    }
  }

  async findByQueueAndAgent(queueId: string, agentId: string): Promise<Result<QueueAssignment>> {
    try {
      const raw = await this.prisma.queueAssignment.findUnique({
        where: {
          queueId_agentId: {
            queueId,
            agentId,
          },
        },
      });

      if (!raw) {
        return Result.fail<QueueAssignment>('Atribuição não encontrada');
      }

      const assignment = this.toDomain(raw);
      return Result.ok<QueueAssignment>(assignment);
    } catch (error) {
      return Result.fail<QueueAssignment>('Erro ao buscar atribuição');
    }
  }

  async create(assignment: QueueAssignment): Promise<Result<QueueAssignment>> {
    try {
      await this.prisma.queueAssignment.create({
        data: {
          id: assignment.id.getValue,
          queueId: assignment.queueId,
          agentId: assignment.agentId,
          order: assignment.order,
          isActive: assignment.isActive,
        },
      });

      return Result.ok<QueueAssignment>(assignment);
    } catch (error) {
      return Result.fail<QueueAssignment>('Erro ao criar atribuição');
    }
  }

  async update(assignment: QueueAssignment): Promise<Result<void>> {
    try {
      await this.prisma.queueAssignment.update({
        where: { id: assignment.id.getValue },
        data: {
          order: assignment.order,
          isActive: assignment.isActive,
        },
      });

      return Result.ok<void>();
    } catch (error) {
      return Result.fail<void>('Erro ao atualizar atribuição');
    }
  }

  async delete(id: string): Promise<Result<void>> {
    try {
      await this.prisma.queueAssignment.delete({
        where: { id },
      });

      return Result.ok<void>();
    } catch (error) {
      return Result.fail<void>('Erro ao deletar atribuição');
    }
  }

  async findByQueue(queueId: string): Promise<Result<QueueAssignment[]>> {
    try {
      const data = await this.prisma.queueAssignment.findMany({
        where: { queueId },
        orderBy: { order: 'asc' },
      });

      const assignments = data.map((raw) => this.toDomain(raw));
      return Result.ok<QueueAssignment[]>(assignments);
    } catch (error) {
      return Result.fail<QueueAssignment[]>('Erro ao listar atribuições');
    }
  }

  async findActiveByQueue(queueId: string): Promise<Result<QueueAssignment[]>> {
    try {
      const data = await this.prisma.queueAssignment.findMany({
        where: {
          queueId,
          isActive: true,
        },
        orderBy: { order: 'asc' },
      });

      const assignments = data.map((raw) => this.toDomain(raw));
      return Result.ok<QueueAssignment[]>(assignments);
    } catch (error) {
      return Result.fail<QueueAssignment[]>('Erro ao listar atribuições ativas');
    }
  }

  private toDomain(raw: any): QueueAssignment {
    return QueueAssignment.create(
      {
        queueId: raw.queueId,
        agentId: raw.agentId,
        order: raw.order,
        isActive: raw.isActive,
      },
      new UniqueEntityID(raw.id)
    );
  }
}
