/**
 * Agent Use Case - Create Agent
 */

import { Injectable } from '@nestjs/common';
import { IUseCase } from '@shared/domain/IUseCase';
import { Result } from '@shared/domain/Result';
import { IAgentRepository } from '../../domain/IAgentRepository';
import { Agent } from '../../domain/Agent';
import { CreateAgentDTO, AgentResponseDTO } from '../dtos/AgentDTOs';
import { AgentMapper } from '../mappers/AgentMapper';
import { UniqueEntityID } from '@shared/domain/UniqueEntityID';
import { AgentStatus } from '@shared/domain/enums';
import { Inject } from '@nestjs/common';

@Injectable()
export class CreateAgentUseCase implements IUseCase<CreateAgentDTO, Result<AgentResponseDTO>> {
  constructor(@Inject('IAgentRepository') private agentRepository: IAgentRepository) {}

  async execute(request: CreateAgentDTO): Promise<Result<AgentResponseDTO>> {
    // Validar entrada
    if (!request.name || request.name.trim().length === 0) {
      return Result.fail<AgentResponseDTO>('Nome do agente é obrigatório');
    }

    // Criar entidade
    const agent = Agent.create(
      {
        tenantId: request.tenantId,
        userId: request.userId,
        name: request.name,
        title: request.title,
        status: AgentStatus.ONLINE,
        isAvailable: true,
        maxConcurrent: 5,
        specialties: request.specialties || [],
        departmentId: request.departmentId,
        currentConversations: 0,
        totalLeads: 0,
        totalClosed: 0,
        settings: {},
      },
      new UniqueEntityID()
    );

    // Validar domínio
    if (!agent.validate()) {
      return Result.fail<AgentResponseDTO>('Dados do agente inválidos');
    }

    // Persistir
    const result = await this.agentRepository.create(agent);
    if (result.isFailure) {
      return Result.fail<AgentResponseDTO>(result.error);
    }

    return Result.ok<AgentResponseDTO>(AgentMapper.toDTO(result.getValue()));
  }
}
