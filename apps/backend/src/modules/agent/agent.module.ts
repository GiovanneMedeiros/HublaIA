/**
 * Agent Module
 */

import { Module } from '@nestjs/common';
import { AgentController } from './infrastructure/controllers/AgentController';
import { CreateAgentUseCase } from './application/usecases/CreateAgentUseCase';
import { UpdateAgentUseCase } from './application/usecases/UpdateAgentUseCase';
import { GetAgentDetailsUseCase } from './application/usecases/GetAgentDetailsUseCase';
import { UpdateAgentAvailabilityUseCase } from './application/usecases/UpdateAgentAvailabilityUseCase';
import { ListAgentsUseCase } from './application/usecases/ListAgentsUseCase';
import { AgentRepository } from './infrastructure/repositories/AgentRepository';
import { IAgentRepository } from './domain/IAgentRepository';

@Module({
  controllers: [AgentController],
  providers: [
    CreateAgentUseCase,
    UpdateAgentUseCase,
    GetAgentDetailsUseCase,
    UpdateAgentAvailabilityUseCase,
    ListAgentsUseCase,
    {
      provide: 'IAgentRepository',
      useClass: AgentRepository,
    },
  ],
  exports: [
    'IAgentRepository',
    CreateAgentUseCase,
    UpdateAgentUseCase,
    GetAgentDetailsUseCase,
    UpdateAgentAvailabilityUseCase,
    ListAgentsUseCase,
  ],
})
export class AgentModule {}
