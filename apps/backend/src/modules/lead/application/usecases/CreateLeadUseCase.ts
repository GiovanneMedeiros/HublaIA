/**
 * Lead Use Case - Create Lead
 */

import { Injectable, Inject } from '@nestjs/common';
import { IUseCase } from '@shared/domain/IUseCase';
import { Result } from '@shared/domain/Result';
import { Lead } from '../../domain/Lead';
import { ILeadRepository } from '../../domain/ILeadRepository';
import { CreateLeadDTO, LeadResponseDTO } from '../dtos/LeadDTOs';
import { LeadMapper } from '../mappers/LeadMapper';
import { LeadStatus, LeadClassification, SentimentType } from '@shared/domain/enums';

@Injectable()
export class CreateLeadUseCase implements IUseCase<CreateLeadDTO, Result<LeadResponseDTO>> {
  constructor(@Inject('ILeadRepository') private leadRepository: ILeadRepository) {}

  async execute(request: CreateLeadDTO): Promise<Result<LeadResponseDTO>> {
    // Criar entidade de domínio
    const lead = Lead.create({
      tenantId: request.tenantId,
      name: request.name,
      email: request.email,
      phone: request.phone,
      whatsappId: request.whatsappId,
      status: LeadStatus.NEW,
      classification: LeadClassification.GRAY,
      qualificationScore: 0,
      sentiment: SentimentType.NEUTRAL,
      source: request.source || 'WHATSAPP',
      tags: [],
      customFields: request.customFields || {},
    });

    // Validar
    if (!lead.validate()) {
      return Result.fail<LeadResponseDTO>('Dados do lead inválidos');
    }

    // Persistir
    const result = await this.leadRepository.create(lead);
    if (result.isFailure) {
      return Result.fail<LeadResponseDTO>(result.error);
    }

    // Retornar DTO
    return Result.ok<LeadResponseDTO>(LeadMapper.toDTO(lead));
  }
}
