/**
 * Lead Use Case - List Leads
 */

import { Injectable, Inject } from '@nestjs/common';
import { IUseCase } from '@shared/domain/IUseCase';
import { Result } from '@shared/domain/Result';
import { ILeadRepository } from '../../domain/ILeadRepository';
import { ListLeadsQueryDTO, LeadResponseDTO } from '../dtos/LeadDTOs';
import { LeadMapper } from '../mappers/LeadMapper';
import { IPaginatedResult } from '@shared/types';

interface ListLeadsRequest extends ListLeadsQueryDTO {
  tenantId: string;
}

@Injectable()
export class ListLeadsUseCase implements IUseCase<
  ListLeadsRequest,
  Result<IPaginatedResult<LeadResponseDTO>>
> {
  constructor(@Inject('ILeadRepository') private leadRepository: ILeadRepository) {}

  async execute(request: ListLeadsRequest): Promise<Result<IPaginatedResult<LeadResponseDTO>>> {
    const result = await this.leadRepository.findByTenant(
      request.tenantId,
      {
        status: request.status,
        classification: request.classification,
        assignedToId: request.assignedToId,
      },
      {
        page: request.page || 1,
        limit: Math.min(request.limit || 10, 100), // max 100 por página
      }
    );

    if (result.isFailure) {
      return Result.fail<IPaginatedResult<LeadResponseDTO>>(result.error);
    }

    const paginatedLeads = result.getValue();

    return Result.ok<IPaginatedResult<LeadResponseDTO>>({
      data: LeadMapper.toDTOArray(paginatedLeads.data),
      total: paginatedLeads.total,
      page: paginatedLeads.page,
      limit: paginatedLeads.limit,
      totalPages: paginatedLeads.totalPages,
    });
  }
}
