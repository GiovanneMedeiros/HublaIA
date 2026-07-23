/**
 * Queue Use Case - List Queues
 */

import { Injectable } from '@nestjs/common';
import { IUseCase } from '@shared/domain/IUseCase';
import { Result } from '@shared/domain/Result';
import { IQueueRepository } from '../../domain/IQueueRepository';
import { QueueResponseDTO } from '../dtos/QueueDTOs';
import { QueueMapper } from '../mappers/QueueMappers';
import { IPaginatedResult } from '@shared/types';
import { Inject } from '@nestjs/common';

interface ListQueuesRequest {
  tenantId: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class ListQueuesUseCase implements IUseCase<
  ListQueuesRequest,
  Result<IPaginatedResult<QueueResponseDTO>>
> {
  constructor(@Inject('IQueueRepository') private queueRepository: IQueueRepository) {}

  async execute(request: ListQueuesRequest): Promise<Result<IPaginatedResult<QueueResponseDTO>>> {
    const result = await this.queueRepository.findByTenant(request.tenantId, {
      page: request.page || 1,
      limit: Math.min(request.limit || 10, 100),
    });

    if (result.isFailure) {
      return Result.fail<IPaginatedResult<QueueResponseDTO>>(result.error);
    }

    const paginatedQueues = result.getValue();

    return Result.ok<IPaginatedResult<QueueResponseDTO>>({
      data: QueueMapper.toDTOArray(paginatedQueues.data),
      total: paginatedQueues.total,
      page: paginatedQueues.page,
      limit: paginatedQueues.limit,
      totalPages: paginatedQueues.totalPages,
    });
  }
}
