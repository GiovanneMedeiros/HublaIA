/**
 * Agent Application - DTOs
 */

import { AgentStatus } from '@shared/domain/enums';
import { IsNumber, IsOptional, IsString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAgentDTO {
  tenantId: string;
  userId: string;
  name: string;
  title?: string;
  departmentId?: string;
  specialties?: string[];
}

export class UpdateAgentAvailabilityDTO {
  tenantId: string;
  agentId: string;
  isAvailable: boolean;
  status?: AgentStatus;
}

export class UpdateAgentDTO {
  tenantId: string;
  agentId: string;
  name?: string;
  title?: string;
  bio?: string;
  specialties?: string[];
}

export class AgentResponseDTO {
  id: string;
  tenantId: string;
  userId: string;
  name: string;
  title?: string;
  bio?: string;
  status: AgentStatus;
  isAvailable: boolean;
  currentConversations: number;
  maxConcurrent: number;
  specialties: string[];
  departmentId?: string;
  totalLeads: number;
  totalClosed: number;
  averageRating?: number;
  responseTime?: number;
  createdAt: Date;
}

export class ListAgentsQueryDTO {
  @Type(() => Number)
  @IsNumber()
  page: number = 1;

  @Type(() => Number)
  @IsNumber()
  limit: number = 10;

  @IsOptional()
  @IsString()
  departmentId?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  onlyAvailable?: boolean;
}
