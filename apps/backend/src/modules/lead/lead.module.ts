/**
 * Lead Module
 */

import { Module } from '@nestjs/common';
import { LeadController } from './infrastructure/controllers/LeadController';
import { CreateLeadUseCase } from './application/usecases/CreateLeadUseCase';
import { QualifyLeadUseCase } from './application/usecases/QualifyLeadUseCase';
import { AutoQualifyLeadUseCase } from './application/usecases/AutoQualifyLeadUseCase';
import { AssignLeadToAgentUseCase } from './application/usecases/AssignLeadToAgentUseCase';
import { GetLeadDetailsUseCase } from './application/usecases/GetLeadDetailsUseCase';
import { ListLeadsUseCase } from './application/usecases/ListLeadsUseCase';
import { LeadRepository } from './infrastructure/repositories/LeadRepository';
import { LeadService } from './infrastructure/services/LeadService';
import { ILeadRepository } from './domain/ILeadRepository';

@Module({
  controllers: [LeadController],
  providers: [
    CreateLeadUseCase,
    QualifyLeadUseCase,
    AutoQualifyLeadUseCase,
    AssignLeadToAgentUseCase,
    GetLeadDetailsUseCase,
    ListLeadsUseCase,
    LeadService,
    {
      provide: 'ILeadRepository',
      useClass: LeadRepository,
    },
  ],
  exports: [
    'ILeadRepository',
    LeadService,
    CreateLeadUseCase,
    QualifyLeadUseCase,
    AutoQualifyLeadUseCase,
    AssignLeadToAgentUseCase,
    GetLeadDetailsUseCase,
    ListLeadsUseCase,
  ],
})
export class LeadModule {}
