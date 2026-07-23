/**
 * Lead Use Case - Assign Lead to Agent
 */

import { Injectable, Inject } from '@nestjs/common';
import { IUseCase } from '@shared/domain/IUseCase';
import { Result } from '@shared/domain/Result';
import { ILeadRepository } from '../../domain/ILeadRepository';
import { AssignLeadToAgentDTO, LeadResponseDTO } from '../dtos/LeadDTOs';
import { LeadMapper } from '../mappers/LeadMapper';

@Injectable()
export class AssignLeadToAgentUseCase implements IUseCase<
  AssignLeadToAgentDTO,
  Result<LeadResponseDTO>
> {
  constructor(@Inject('ILeadRepository') private leadRepository: ILeadRepository) {}

  async execute(request: AssignLeadToAgentDTO): Promise<Result<LeadResponseDTO>> {
    // Buscar lead
    const leadOrError = await this.leadRepository.findById(request.leadId, request.tenantId);
    if (leadOrError.isFailure) {
      return Result.fail<LeadResponseDTO>('Lead não encontrado');
    }

    const lead = leadOrError.getValue();

    // Atribuir ao agente
    try {
      lead.assignToAgent(request.agentId);
    } catch (error) {
      return Result.fail<LeadResponseDTO>((error as Error).message);
    }

    // Persistir
    const result = await this.leadRepository.update(lead);
    if (result.isFailure) {
      return Result.fail<LeadResponseDTO>(result.error);
    }

    return Result.ok<LeadResponseDTO>(LeadMapper.toDTO(lead));
  }
}
