/**
 * Queue Domain - Repository Interfaces
 */

import { Queue, QueueAssignment } from './Queue';
import { Result } from '@shared/domain/Result';
import { IPaginatedResult, IPaginationOptions } from '@shared/types';

export interface IQueueRepository {
  findById(id: string, tenantId: string): Promise<Result<Queue>>;
  findByName(name: string, tenantId: string): Promise<Result<Queue>>;
  create(queue: Queue): Promise<Result<Queue>>;
  update(queue: Queue): Promise<Result<void>>;
  delete(id: string, tenantId: string): Promise<Result<void>>;
  findByTenant(
    tenantId: string,
    pagination?: IPaginationOptions
  ): Promise<Result<IPaginatedResult<Queue>>>;
  findByDepartment(tenantId: string, departmentId: string): Promise<Result<Queue[]>>;
}

export interface IQueueAssignmentRepository {
  findById(id: string): Promise<Result<QueueAssignment>>;
  findByQueueAndAgent(queueId: string, agentId: string): Promise<Result<QueueAssignment>>;
  create(assignment: QueueAssignment): Promise<Result<QueueAssignment>>;
  update(assignment: QueueAssignment): Promise<Result<void>>;
  delete(id: string): Promise<Result<void>>;
  findByQueue(queueId: string): Promise<Result<QueueAssignment[]>>;
  findActiveByQueue(queueId: string): Promise<Result<QueueAssignment[]>>;
}

export interface IQueueDistributionStrategy {
  selectAgent(assignments: QueueAssignment[], leadId: string): Promise<Result<string>>; // Retorna agentId
}
