/**
 * Agent Use Case - Update Availability
 */

import { Injectable } from '@nestjs/common';
import { IUseCase } from '@shared/domain/IUseCase';
import { Result } from '@shared/domain/Result';
import { IAgentRepository } from '../../domain/IAgentRepository';
import { UpdateAgentAvailabilityDTO, AgentResponseDTO } from '../dtos/AgentDTOs';
import { AgentMapper } from '../mappers/AgentMapper';
import { Inject } from '@nestjs/common';

@Injectable()
export class UpdateAgentAvailabilityUseCase implements IUseCase<
  UpdateAgentAvailabilityDTO,
  Result<AgentResponseDTO>
> {
  constructor(@Inject('IAgentRepository') private agentRepository: IAgentRepository) {}

  async execute(request: UpdateAgentAvailabilityDTO): Promise<Result<AgentResponseDTO>> {
    const agentOrError = await this.agentRepository.findById(request.agentId, request.tenantId);

    if (agentOrError.isFailure) {
      return Result.fail<AgentResponseDTO>('Agente não encontrado');
    }

    const agent = agentOrError.getValue();
    agent.setAvailability(request.isAvailable);

    const result = await this.agentRepository.update(agent);
    if (result.isFailure) {
      return Result.fail<AgentResponseDTO>(result.error);
    }

    return Result.ok<AgentResponseDTO>(AgentMapper.toDTO(agent));
  }
}
