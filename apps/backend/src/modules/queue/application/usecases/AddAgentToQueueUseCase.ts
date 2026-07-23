/**
 * Queue Use Case - Add Agent To Queue
 */

import { Injectable } from '@nestjs/common';
import { IUseCase } from '@shared/domain/IUseCase';
import { Result } from '@shared/domain/Result';
import { IQueueRepository, IQueueAssignmentRepository } from '../../domain/IQueueRepository';
import { QueueAssignment } from '../../domain/Queue';
import { AddAgentToQueueDTO, QueueAssignmentResponseDTO } from '../dtos/QueueDTOs';
import { QueueAssignmentMapper } from '../mappers/QueueMappers';
import { UniqueEntityID } from '@shared/domain/UniqueEntityID';
import { Inject } from '@nestjs/common';

@Injectable()
export class AddAgentToQueueUseCase implements IUseCase<
  AddAgentToQueueDTO,
  Result<QueueAssignmentResponseDTO>
> {
  constructor(
    @Inject('IQueueRepository') private queueRepository: IQueueRepository,
    @Inject('IQueueAssignmentRepository')
    private assignmentRepository: IQueueAssignmentRepository
  ) {}

  async execute(request: AddAgentToQueueDTO): Promise<Result<QueueAssignmentResponseDTO>> {
    // Validar fila
    const queueOrError = await this.queueRepository.findById(request.queueId, request.tenantId);

    if (queueOrError.isFailure) {
      return Result.fail<QueueAssignmentResponseDTO>('Fila não encontrada');
    }

    // Verificar se já existe
    const existingOrError = await this.assignmentRepository.findByQueueAndAgent(
      request.queueId,
      request.agentId
    );

    if (existingOrError.isSuccess) {
      return Result.fail<QueueAssignmentResponseDTO>('Agente já está na fila');
    }

    // Criar nova atribuição
    const assignment = QueueAssignment.create(
      {
        queueId: request.queueId,
        agentId: request.agentId,
        order: request.order,
        isActive: true,
      },
      new UniqueEntityID()
    );

    // Validar
    if (!assignment.validate()) {
      return Result.fail<QueueAssignmentResponseDTO>('Dados da atribuição inválidos');
    }

    // Persistir
    const result = await this.assignmentRepository.create(assignment);
    if (result.isFailure) {
      return Result.fail<QueueAssignmentResponseDTO>(result.error);
    }

    return Result.ok<QueueAssignmentResponseDTO>(QueueAssignmentMapper.toDTO(result.getValue()));
  }
}
