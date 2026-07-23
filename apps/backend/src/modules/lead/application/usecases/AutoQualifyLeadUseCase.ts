/**
 * Lead Use Case - Auto-Qualify Lead with AI
 */

import { Injectable } from '@nestjs/common';
import { IUseCase } from '@shared/domain/IUseCase';
import { Result } from '@shared/domain/Result';
import { ILeadRepository } from '../../domain/ILeadRepository';
import { LeadResponseDTO } from '../dtos/LeadDTOs';
import { LeadMapper } from '../mappers/LeadMapper';
import { OpenAIService } from '@shared/infrastructure/services/OpenAIService';
import { Inject } from '@nestjs/common';

interface AutoQualifyLeadRequest {
  tenantId: string;
  leadId: string;
}

@Injectable()
export class AutoQualifyLeadUseCase implements IUseCase<
  AutoQualifyLeadRequest,
  Result<LeadResponseDTO>
> {
  constructor(
    @Inject('ILeadRepository') private leadRepository: ILeadRepository,
    private openaiService: OpenAIService
  ) {}

  async execute(request: AutoQualifyLeadRequest): Promise<Result<LeadResponseDTO>> {
    // Buscar lead
    const leadOrError = await this.leadRepository.findById(request.leadId, request.tenantId);

    if (leadOrError.isFailure) {
      return Result.fail<LeadResponseDTO>('Lead não encontrado');
    }

    const lead = leadOrError.getValue();

    // Coletar dados do lead para análise
    const leadData = {
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      messages: [], // TODO: Buscar mensagens do lead
      customFields: lead.props.customFields,
    };

    // Qualificar com OpenAI
    const qualification = await this.openaiService.qualifyLead(leadData);

    // Atualizar lead com resultados
    lead.qualify(
      qualification.qualificationScore,
      qualification.classification as any,
      qualification.sentiment as any
    );

    lead.updateIntent(
      qualification.intent,
      qualification.summary,
      `Entidades: ${qualification.entities.join(', ')}`
    );

    // Persistir
    const result = await this.leadRepository.update(lead);
    if (result.isFailure) {
      return Result.fail<LeadResponseDTO>(result.error);
    }

    return Result.ok<LeadResponseDTO>(LeadMapper.toDTO(lead));
  }
}
