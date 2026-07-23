/**
 * Lead Infrastructure - Repository Implementation
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/database/PrismaService';
import { ILeadRepository } from '../../domain/ILeadRepository';
import { Lead } from '../../domain/Lead';
import { Result } from '@shared/domain/Result';
import { UniqueEntityID } from '@shared/domain/UniqueEntityID';
import { IPaginatedResult, IPaginationOptions } from '@shared/types';
import { LeadStatus, LeadClassification } from '@shared/domain/enums';

@Injectable()
export class LeadRepository implements ILeadRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string, tenantId: string): Promise<Result<Lead>> {
    try {
      const raw = await this.prisma.lead.findUnique({
        where: { id },
      });

      if (!raw || raw.tenantId !== tenantId) {
        return Result.fail<Lead>('Lead não encontrado');
      }

      const lead = this.toDomain(raw);
      return Result.ok<Lead>(lead);
    } catch (error) {
      return Result.fail<Lead>('Erro ao buscar lead');
    }
  }

  async findByPhone(phone: string, tenantId: string): Promise<Result<Lead>> {
    try {
      const raw = await this.prisma.lead.findFirst({
        where: {
          tenantId,
          phone,
          deletedAt: null,
        },
      });

      if (!raw) {
        return Result.fail<Lead>('Lead não encontrado');
      }

      const lead = this.toDomain(raw);
      return Result.ok<Lead>(lead);
    } catch (error) {
      return Result.fail<Lead>('Erro ao buscar lead');
    }
  }

  async findByWhatsAppId(whatsappId: string, tenantId: string): Promise<Result<Lead>> {
    try {
      const raw = await this.prisma.lead.findFirst({
        where: {
          tenantId,
          whatsappId,
          deletedAt: null,
        },
      });

      if (!raw) {
        return Result.fail<Lead>('Lead não encontrado');
      }

      const lead = this.toDomain(raw);
      return Result.ok<Lead>(lead);
    } catch (error) {
      return Result.fail<Lead>('Erro ao buscar lead');
    }
  }

  async create(lead: Lead): Promise<Result<Lead>> {
    try {
      const raw = await this.prisma.lead.create({
        data: {
          id: lead.id.getValue,
          tenantId: lead.tenantId,
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          whatsappId: lead.whatsappId,
          status: lead.status,
          classification: lead.classification,
          qualificationScore: lead.qualificationScore,
          sentiment: lead.sentiment,
          source: lead.props.source,
          tags: lead.props.tags,
          customFields: lead.props.customFields,
        },
      });

      return Result.ok<Lead>(lead);
    } catch (error) {
      return Result.fail<Lead>('Erro ao criar lead');
    }
  }

  async update(lead: Lead): Promise<Result<void>> {
    try {
      await this.prisma.lead.update({
        where: { id: lead.id.getValue },
        data: {
          status: lead.status,
          classification: lead.classification,
          qualificationScore: lead.qualificationScore,
          sentiment: lead.sentiment,
          assignedToId: lead.assignedToId,
          queueId: lead.queueId,
          aiSummary: lead.aiSummary,
          aiNotes: lead.props.aiNotes,
          intent: lead.intent,
          tags: lead.props.tags,
          customFields: lead.props.customFields,
          lastMessageAt: lead.props.lastMessageAt,
          assignedAt: lead.props.assignedAt,
          closedAt: lead.props.closedAt,
        },
      });

      return Result.ok<void>();
    } catch (error) {
      return Result.fail<void>('Erro ao atualizar lead');
    }
  }

  async delete(id: string, tenantId: string): Promise<Result<void>> {
    try {
      await this.prisma.lead.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });

      return Result.ok<void>();
    } catch (error) {
      return Result.fail<void>('Erro ao deletar lead');
    }
  }

  async findByTenant(
    tenantId: string,
    filters?: {
      status?: LeadStatus;
      classification?: LeadClassification;
      assignedToId?: string;
    },
    pagination?: IPaginationOptions
  ): Promise<Result<IPaginatedResult<Lead>>> {
    try {
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;
      const offset = (page - 1) * limit;

      const where: any = {
        tenantId,
        deletedAt: null,
      };

      if (filters?.status) {
        where.status = filters.status;
      }

      if (filters?.classification) {
        where.classification = filters.classification;
      }

      if (filters?.assignedToId) {
        where.assignedToId = filters.assignedToId;
      }

      const [data, total] = await Promise.all([
        this.prisma.lead.findMany({
          where,
          skip: offset,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.lead.count({ where }),
      ]);

      const leads = data.map((raw) => this.toDomain(raw));

      return Result.ok<IPaginatedResult<Lead>>({
        data: leads,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      return Result.fail<IPaginatedResult<Lead>>('Erro ao listar leads');
    }
  }

  async findUnassignedByTenant(
    tenantId: string,
    pagination?: IPaginationOptions
  ): Promise<Result<IPaginatedResult<Lead>>> {
    return this.findByTenant(
      tenantId,
      {
        status: LeadStatus.NEW,
      },
      pagination
    );
  }

  private toDomain(raw: any): Lead {
    return Lead.create(
      {
        tenantId: raw.tenantId,
        name: raw.name,
        email: raw.email,
        phone: raw.phone,
        whatsappId: raw.whatsappId,
        status: raw.status,
        classification: raw.classification,
        qualificationScore: raw.qualificationScore,
        sentiment: raw.sentiment,
        assignedToId: raw.assignedToId,
        queueId: raw.queueId,
        source: raw.source,
        tags: raw.tags,
        customFields: raw.customFields,
        aiSummary: raw.aiSummary,
        aiNotes: raw.aiNotes,
        intent: raw.intent,
        assignedAt: raw.assignedAt,
        closedAt: raw.closedAt,
      },
      new UniqueEntityID(raw.id)
    );
  }
}
