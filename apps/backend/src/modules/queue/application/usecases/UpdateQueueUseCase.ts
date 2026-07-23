/**
 * Queue Use Case - Update Queue
 */

import { Injectable } from '@nestjs/common';
import { IUseCase } from '@shared/domain/IUseCase';
import { Result } from '@shared/domain/Result';
import { IQueueRepository } from '../../domain/IQueueRepository';
import { UpdateQueueDTO } from '../dtos/QueueDTOs';
import { QueueResponseDTO } from '../dtos/QueueDTOs';
import { QueueMapper } from '../mappers/QueueMappers';
import { Inject } from '@nestjs/common';

@Injectable()
export class UpdateQueueUseCase implements IUseCase<UpdateQueueDTO, Result<QueueResponseDTO>> {
  constructor(@Inject('IQueueRepository') private queueRepository: IQueueRepository) {}

  async execute(request: UpdateQueueDTO): Promise<Result<QueueResponseDTO>> {
    // Buscar fila
    const queueOrError = await this.queueRepository.findById(request.queueId, request.tenantId);

    if (queueOrError.isFailure) {
      return Result.fail<QueueResponseDTO>('Fila não encontrada');
    }

    const queue = queueOrError.getValue();

    // Atualizar campos
    if (request.name) {
      queue.props.name = request.name;
    }

    if (request.description !== undefined) {
      queue.props.description = request.description;
    }

    if (request.strategy) {
      queue.updateStrategy(request.strategy);
    }

    // Validar
    if (!queue.validate()) {
      return Result.fail<QueueResponseDTO>('Dados da fila inválidos');
    }

    // Persistir
    const result = await this.queueRepository.update(queue);
    if (result.isFailure) {
      return Result.fail<QueueResponseDTO>(result.error);
    }

    return Result.ok<QueueResponseDTO>(QueueMapper.toDTO(queue));
  }
}
