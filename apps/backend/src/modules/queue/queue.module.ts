/**
 * Queue Module
 */

import { Module } from '@nestjs/common';
import { QueueController } from './infrastructure/controllers/QueueController';
import { CreateQueueUseCase } from './application/usecases/CreateQueueUseCase';
import { AddAgentToQueueUseCase } from './application/usecases/AddAgentToQueueUseCase';
import { UpdateQueueUseCase } from './application/usecases/UpdateQueueUseCase';
import { GetNextAgentUseCase } from './application/usecases/GetNextAgentUseCase';
import { ListQueuesUseCase } from './application/usecases/ListQueuesUseCase';
import {
  QueueRepository,
  QueueAssignmentRepository,
} from './infrastructure/repositories/QueueRepositories';
import { QueueService } from './infrastructure/services/QueueService';
import { IQueueRepository, IQueueAssignmentRepository } from './domain/IQueueRepository';

@Module({
  controllers: [QueueController],
  providers: [
    CreateQueueUseCase,
    AddAgentToQueueUseCase,
    UpdateQueueUseCase,
    GetNextAgentUseCase,
    ListQueuesUseCase,
    QueueService,
    {
      provide: 'IQueueRepository',
      useClass: QueueRepository,
    },
    {
      provide: 'IQueueAssignmentRepository',
      useClass: QueueAssignmentRepository,
    },
  ],
  exports: [
    'IQueueRepository',
    'IQueueAssignmentRepository',
    QueueService,
    CreateQueueUseCase,
    AddAgentToQueueUseCase,
    UpdateQueueUseCase,
    GetNextAgentUseCase,
    ListQueuesUseCase,
  ],
})
export class QueueModule {}
