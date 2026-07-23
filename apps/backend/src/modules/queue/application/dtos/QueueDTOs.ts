/**
 * Queue Application - DTOs
 */

import { QueueStrategy } from '@shared/domain/enums';

export class CreateQueueDTO {
  tenantId: string;
  name: string;
  description?: string;
  strategy: QueueStrategy;
  departmentId?: string;
  maxRetries?: number;
  assignmentTimeout?: number;
}

export class UpdateQueueDTO {
  tenantId: string;
  queueId: string;
  name?: string;
  description?: string;
  strategy?: QueueStrategy;
}

export class AddAgentToQueueDTO {
  tenantId: string;
  queueId: string;
  agentId: string;
  order: number;
}

export class GetNextAgentDTO {
  tenantId: string;
  queueId: string;
  leadId: string;
}

export class QueueResponseDTO {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  strategy: QueueStrategy;
  departmentId?: string;
  isActive: boolean;
  maxRetries: number;
  assignmentTimeout: number;
  createdAt: Date;
}

export class QueueAssignmentResponseDTO {
  id: string;
  queueId: string;
  agentId: string;
  order: number;
  isActive: boolean;
}
