/**
 * Lead Use Case - Get Lead Details
 */

import { Injectable, Inject } from '@nestjs/common';
import { IUseCase } from '@shared/domain/IUseCase';
import { Result } from '@shared/domain/Result';
import { ILeadRepository } from '../../domain/ILeadRepository';
import { LeadResponseDTO } from '../dtos/LeadDTOs';
import { LeadMapper } from '../mappers/LeadMapper';

interface GetLeadDetailsRequest {
  tenantId: string;
  leadId: string;
}

@Injectable()
export class GetLeadDetailsUseCase implements IUseCase<
  GetLeadDetailsRequest,
  Result<LeadResponseDTO>
> {
  constructor(@Inject('ILeadRepository') private leadRepository: ILeadRepository) {}

  async execute(request: GetLeadDetailsRequest): Promise<Result<LeadResponseDTO>> {
    const leadOrError = await this.leadRepository.findById(request.leadId, request.tenantId);

    if (leadOrError.isFailure) {
      return Result.fail<LeadResponseDTO>('Lead não encontrado');
    }

    const lead = leadOrError.getValue();
    return Result.ok<LeadResponseDTO>(LeadMapper.toDTO(lead));
  }
}
