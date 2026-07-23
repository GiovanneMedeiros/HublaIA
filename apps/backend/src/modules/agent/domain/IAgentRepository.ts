/**
 * Agent Domain - Repository Interface
 */

import { Agent } from './Agent';
import { Result } from '@shared/domain/Result';
import { IPaginatedResult, IPaginationOptions } from '@shared/types';

export interface IAgentRepository {
  findById(id: string, tenantId: string): Promise<Result<Agent>>;
  findByUserId(userId: string, tenantId: string): Promise<Result<Agent>>;
  create(agent: Agent): Promise<Result<Agent>>;
  update(agent: Agent): Promise<Result<void>>;
  delete(id: string, tenantId: string): Promise<Result<void>>;
  findByTenant(
    tenantId: string,
    pagination?: IPaginationOptions
  ): Promise<Result<IPaginatedResult<Agent>>>;
  findAvailableByTenant(
    tenantId: string,
    pagination?: IPaginationOptions
  ): Promise<Result<IPaginatedResult<Agent>>>;
  findByDepartment(
    tenantId: string,
    departmentId: string,
    pagination?: IPaginationOptions
  ): Promise<Result<IPaginatedResult<Agent>>>;
}
