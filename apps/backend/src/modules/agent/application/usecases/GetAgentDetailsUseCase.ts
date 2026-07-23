/**
 * Agent Use Case - Get Agent Details
 */

import { Injectable } from '@nestjs/common';
import { IUseCase } from '@shared/domain/IUseCase';
import { Result } from '@shared/domain/Result';
import { IAgentRepository } from '../../domain/IAgentRepository';
import { AgentResponseDTO } from '../dtos/AgentDTOs';
import { AgentMapper } from '../mappers/AgentMapper';
import { Inject } from '@nestjs/common';

interface GetAgentDetailsRequest {
  tenantId: string;
  agentId: string;
}

@Injectable()
export class GetAgentDetailsUseCase implements IUseCase<
  GetAgentDetailsRequest,
  Result<AgentResponseDTO>
> {
  constructor(@Inject('IAgentRepository') private agentRepository: IAgentRepository) {}

  async execute(request: GetAgentDetailsRequest): Promise<Result<AgentResponseDTO>> {
    const agentOrError = await this.agentRepository.findById(request.agentId, request.tenantId);

    if (agentOrError.isFailure) {
      return Result.fail<AgentResponseDTO>('Agente não encontrado');
    }

    const agent = agentOrError.getValue();
    return Result.ok<AgentResponseDTO>(AgentMapper.toDTO(agent));
  }
}
