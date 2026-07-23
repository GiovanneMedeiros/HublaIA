/**
 * Agent Use Case - Update Agent
 */

import { Injectable } from '@nestjs/common';
import { IUseCase } from '@shared/domain/IUseCase';
import { Result } from '@shared/domain/Result';
import { IAgentRepository } from '../../domain/IAgentRepository';
import { UpdateAgentDTO, AgentResponseDTO } from '../dtos/AgentDTOs';
import { AgentMapper } from '../mappers/AgentMapper';
import { Inject } from '@nestjs/common';

@Injectable()
export class UpdateAgentUseCase implements IUseCase<UpdateAgentDTO, Result<AgentResponseDTO>> {
  constructor(@Inject('IAgentRepository') private agentRepository: IAgentRepository) {}

  async execute(request: UpdateAgentDTO): Promise<Result<AgentResponseDTO>> {
    // Buscar agente
    const agentOrError = await this.agentRepository.findById(request.agentId, request.tenantId);

    if (agentOrError.isFailure) {
      return Result.fail<AgentResponseDTO>('Agente não encontrado');
    }

    const agent = agentOrError.getValue();

    // Atualizar apenas campos fornecidos
    if (request.name) {
      const updated = agent.props;
      updated.name = request.name;
    }

    if (request.title !== undefined) {
      agent.props.title = request.title;
    }

    if (request.bio !== undefined) {
      agent.props.bio = request.bio;
    }

    if (request.specialties) {
      agent.props.specialties = request.specialties;
    }

    // Validar
    if (!agent.validate()) {
      return Result.fail<AgentResponseDTO>('Dados do agente inválidos');
    }

    // Persistir
    const result = await this.agentRepository.update(agent);
    if (result.isFailure) {
      return Result.fail<AgentResponseDTO>(result.error);
    }

    return Result.ok<AgentResponseDTO>(AgentMapper.toDTO(agent));
  }
}
