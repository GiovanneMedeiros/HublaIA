/**
 * Queue Use Case - Create Queue
 */

import { Injectable } from '@nestjs/common';
import { IUseCase } from '@shared/domain/IUseCase';
import { Result } from '@shared/domain/Result';
import { IQueueRepository } from '../../domain/IQueueRepository';
import { Queue } from '../../domain/Queue';
import { CreateQueueDTO, QueueResponseDTO } from '../dtos/QueueDTOs';
import { QueueMapper } from '../mappers/QueueMappers';
import { UniqueEntityID } from '@shared/domain/UniqueEntityID';
import { Inject } from '@nestjs/common';

@Injectable()
export class CreateQueueUseCase implements IUseCase<CreateQueueDTO, Result<QueueResponseDTO>> {
  constructor(@Inject('IQueueRepository') private queueRepository: IQueueRepository) {}

  async execute(request: CreateQueueDTO): Promise<Result<QueueResponseDTO>> {
    // Validar
    if (!request.name || request.name.trim().length === 0) {
      return Result.fail<QueueResponseDTO>('Nome da fila é obrigatório');
    }

    // Criar entidade
    const queue = Queue.create(
      {
        tenantId: request.tenantId,
        name: request.name,
        description: request.description,
        strategy: request.strategy,
        departmentId: request.departmentId,
        isActive: true,
        maxRetries: request.maxRetries || 3,
        assignmentTimeout: request.assignmentTimeout || 300,
        settings: {},
      },
      new UniqueEntityID()
    );

    // Validar domínio
    if (!queue.validate()) {
      return Result.fail<QueueResponseDTO>('Dados da fila inválidos');
    }

    // Persistir
    const result = await this.queueRepository.create(queue);
    if (result.isFailure) {
      return Result.fail<QueueResponseDTO>(result.error);
    }

    return Result.ok<QueueResponseDTO>(QueueMapper.toDTO(result.getValue()));
  }
}
