/**
 * Lead Application - DTOs
 */

import { LeadStatus, LeadClassification, SentimentType } from '@shared/domain/enums';
import { IsString, IsEmail, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLeadDTO {
  tenantId: string;
  name: string;
  email?: string;
  phone: string;
  whatsappId?: string;
  source: string;
  customFields?: Record<string, any>;
}

export class QualifyLeadDTO {
  tenantId: string;
  leadId: string;
  qualificationScore: number;
  classification: LeadClassification;
  sentiment: SentimentType;
  aiSummary?: string;
  aiNotes?: string;
  intent?: string;
}

export class AssignLeadToAgentDTO {
  tenantId: string;
  leadId: string;
  agentId: string;
}

export class UpdateLeadStatusDTO {
  tenantId: string;
  leadId: string;
  status: LeadStatus;
}

export class LeadResponseDTO {
  id: string;
  tenantId: string;
  name: string;
  email?: string;
  phone: string;
  whatsappId?: string;
  status: LeadStatus;
  classification: LeadClassification;
  qualificationScore: number;
  sentiment: SentimentType;
  assignedToId?: string;
  queueId?: string;
  source: string;
  tags: string[];
  customFields: Record<string, any>;
  aiSummary?: string;
  intent?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ListLeadsQueryDTO {
  @Type(() => Number)
  @IsNumber()
  page: number = 1;

  @Type(() => Number)
  @IsNumber()
  limit: number = 10;

  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @IsOptional()
  @IsEnum(LeadClassification)
  classification?: LeadClassification;

  @IsOptional()
  @IsString()
  assignedToId?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
