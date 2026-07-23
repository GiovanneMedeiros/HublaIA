/**
 * Lead Use Case - Qualify Lead
 */

import { Injectable, Inject } from '@nestjs/common';
import { IUseCase } from '@shared/domain/IUseCase';
import { Result } from '@shared/domain/Result';
import { ILeadRepository } from '../../domain/ILeadRepository';
import { QualifyLeadDTO, LeadResponseDTO } from '../dtos/LeadDTOs';
import { LeadMapper } from '../mappers/LeadMapper';

@Injectable()
export class QualifyLeadUseCase implements IUseCase<QualifyLeadDTO, Result<LeadResponseDTO>> {
  constructor(@Inject('ILeadRepository') private leadRepository: ILeadRepository) {}

  async execute(request: QualifyLeadDTO): Promise<Result<LeadResponseDTO>> {
    // Buscar lead
    const leadOrError = await this.leadRepository.findById(request.leadId, request.tenantId);
    if (leadOrError.isFailure) {
      return Result.fail<LeadResponseDTO>('Lead não encontrado');
    }

    const lead = leadOrError.getValue();

    // Aplicar qualificação
    try {
      lead.qualify(request.qualificationScore, request.classification, request.sentiment);
      lead.updateIntent(request.intent || '', request.aiSummary || '', request.aiNotes);
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
