/**
 * Queue Use Case - Get Next Agent in Queue
 */

import { Injectable } from '@nestjs/common';
import { IUseCase } from '@shared/domain/IUseCase';
import { Result } from '@shared/domain/Result';
import { IQueueRepository, IQueueAssignmentRepository } from '../../domain/IQueueRepository';
import { GetNextAgentDTO } from '../dtos/QueueDTOs';
import { QueueStrategyFactory } from '../strategies/QueueStrategies';
import { Inject } from '@nestjs/common';

interface GetNextAgentResponse {
  agentId: string;
  queueId: string;
}

@Injectable()
export class GetNextAgentUseCase implements IUseCase<
  GetNextAgentDTO,
  Result<GetNextAgentResponse>
> {
  constructor(
    @Inject('IQueueRepository') private queueRepository: IQueueRepository,
    @Inject('IQueueAssignmentRepository')
    private assignmentRepository: IQueueAssignmentRepository
  ) {}

  async execute(request: GetNextAgentDTO): Promise<Result<GetNextAgentResponse>> {
    // Buscar fila
    const queueOrError = await this.queueRepository.findById(request.queueId, request.tenantId);

    if (queueOrError.isFailure) {
      return Result.fail<GetNextAgentResponse>('Fila não encontrada');
    }

    const queue = queueOrError.getValue();

    // Buscar atribuições ativas
    const assignmentsOrError = await this.assignmentRepository.findActiveByQueue(
      queue.id.toString()
    );

    if (assignmentsOrError.isFailure) {
      return Result.fail<GetNextAgentResponse>('Erro ao buscar atribuições da fila');
    }

    const assignments = assignmentsOrError.getValue();

    // Usar estratégia para selecionar agente
    const strategy = QueueStrategyFactory.create(queue.strategy);
    const agentOrError = await strategy.selectAgent(assignments);

    if (agentOrError.isFailure) {
      return Result.fail<GetNextAgentResponse>(agentOrError.error);
    }

    return Result.ok<GetNextAgentResponse>({
      agentId: agentOrError.getValue(),
      queueId: queue.id.toString(),
    });
  }
}
