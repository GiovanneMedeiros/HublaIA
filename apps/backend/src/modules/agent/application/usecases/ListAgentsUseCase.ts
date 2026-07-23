/**
 * Agent Use Case - List Agents
 */

import { Injectable } from '@nestjs/common';
import { IUseCase } from '@shared/domain/IUseCase';
import { Result } from '@shared/domain/Result';
import { IAgentRepository } from '../../domain/IAgentRepository';
import { ListAgentsQueryDTO, AgentResponseDTO } from '../dtos/AgentDTOs';
import { AgentMapper } from '../mappers/AgentMapper';
import { IPaginatedResult } from '@shared/types';
import { Inject } from '@nestjs/common';

interface ListAgentsRequest extends ListAgentsQueryDTO {
  tenantId: string;
}

@Injectable()
export class ListAgentsUseCase implements IUseCase<
  ListAgentsRequest,
  Result<IPaginatedResult<AgentResponseDTO>>
> {
  constructor(@Inject('IAgentRepository') private agentRepository: IAgentRepository) {}

  async execute(request: ListAgentsRequest): Promise<Result<IPaginatedResult<AgentResponseDTO>>> {
    let result;

    if (request.onlyAvailable) {
      result = await this.agentRepository.findAvailableByTenant(request.tenantId, {
        page: request.page || 1,
        limit: Math.min(request.limit || 10, 100),
      });
    } else if (request.departmentId) {
      result = await this.agentRepository.findByDepartment(request.tenantId, request.departmentId, {
        page: request.page || 1,
        limit: Math.min(request.limit || 10, 100),
      });
    } else {
      result = await this.agentRepository.findByTenant(request.tenantId, {
        page: request.page || 1,
        limit: Math.min(request.limit || 10, 100),
      });
    }

    if (result.isFailure) {
      return Result.fail<IPaginatedResult<AgentResponseDTO>>(result.error);
    }

    const paginatedAgents = result.getValue();

    return Result.ok<IPaginatedResult<AgentResponseDTO>>({
      data: AgentMapper.toDTOArray(paginatedAgents.data),
      total: paginatedAgents.total,
      page: paginatedAgents.page,
      limit: paginatedAgents.limit,
      totalPages: paginatedAgents.totalPages,
    });
  }
}
