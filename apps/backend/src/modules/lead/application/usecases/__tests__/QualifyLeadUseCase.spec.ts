/**
 * Tests for QualifyLeadUseCase
 */

import { Test, TestingModule } from '@nestjs/testing';
import { QualifyLeadUseCase } from '../QualifyLeadUseCase';
import { ILeadRepository } from '../../../domain/ILeadRepository';
import { Lead } from '../../../domain/Lead';
import { UniqueEntityID } from '@shared/domain/UniqueEntityID';
import { Result } from '@shared/domain/Result';
import {
  LeadStatus,
  LeadClassification,
  SentimentType,
} from '@shared/domain/enums';

describe('QualifyLeadUseCase', () => {
  let useCase: QualifyLeadUseCase;
  let leadRepository: ILeadRepository;

  const mockLead = {
    id: new UniqueEntityID('lead-123'),
    tenantId: 'tenant-123',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+5511999999999',
    whatsappId: 'whatsapp-123',
    status: LeadStatus.NEW,
    classification: LeadClassification.GRAY,
    qualificationScore: 0,
    sentiment: SentimentType.NEUTRAL,
    assignedToId: null,
    queueId: null,
    props: {
      tags: [],
      customFields: {},
      source: 'WHATSAPP',
      aiNotes: null,
      lastMessageAt: null,
      assignedAt: null,
      closedAt: null,
    },
    qualify: jest.fn(),
    updateIntent: jest.fn(),
    validate: jest.fn().mockReturnValue(true),
  };

  const mockLeadRepository = {
    findById: jest.fn().mockResolvedValue(Result.ok(mockLead)),
    findByPhone: jest.fn(),
    findByWhatsAppId: jest.fn(),
    create: jest.fn(),
    update: jest.fn().mockResolvedValue(Result.ok()),
    delete: jest.fn(),
    findByTenant: jest.fn(),
    findUnassignedByTenant: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QualifyLeadUseCase,
        {
          provide: 'ILeadRepository',
          useValue: mockLeadRepository,
        },
      ],
    }).compile();

    useCase = module.get<QualifyLeadUseCase>(QualifyLeadUseCase);
    leadRepository = module.get<ILeadRepository>('ILeadRepository');

    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should qualify a lead successfully', async () => {
      const input = {
        tenantId: 'tenant-123',
        leadId: 'lead-123',
        qualificationScore: 85,
        classification: LeadClassification.GREEN,
        sentiment: SentimentType.POSITIVE,
        aiSummary: 'High quality lead',
        aiNotes: 'Very interested in product',
        intent: 'Purchase',
      };

      const result = await useCase.execute(input);

      expect(result.isSuccess).toBe(true);
      expect(mockLead.qualify).toHaveBeenCalledWith(
        85,
        LeadClassification.GREEN,
        SentimentType.POSITIVE,
      );
      expect(mockLeadRepository.update).toHaveBeenCalled();
    });

    it('should fail with invalid qualification score (negative)', async () => {
      const input = {
        tenantId: 'tenant-123',
        leadId: 'lead-123',
        qualificationScore: -10,
        classification: LeadClassification.GREEN,
        sentiment: SentimentType.POSITIVE,
        aiSummary: 'High quality lead',
        aiNotes: 'Very interested',
        intent: 'Purchase',
      };

      const result = await useCase.execute(input);

      expect(result.isFailure).toBe(true);
    });

    it('should fail with invalid qualification score (over 100)', async () => {
      const input = {
        tenantId: 'tenant-123',
        leadId: 'lead-123',
        qualificationScore: 150,
        classification: LeadClassification.GREEN,
        sentiment: SentimentType.POSITIVE,
        aiSummary: 'High quality lead',
        aiNotes: 'Very interested',
        intent: 'Purchase',
      };

      const result = await useCase.execute(input);

      expect(result.isFailure).toBe(true);
    });

    it('should fail when lead not found', async () => {
      mockLeadRepository.findById.mockResolvedValueOnce(
        Result.fail('Lead not found'),
      );

      const input = {
        tenantId: 'tenant-123',
        leadId: 'nonexistent',
        qualificationScore: 85,
        classification: LeadClassification.GREEN,
        sentiment: SentimentType.POSITIVE,
        aiSummary: 'High quality lead',
        aiNotes: 'Very interested',
        intent: 'Purchase',
      };

      const result = await useCase.execute(input);

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('não encontrado');
    });

    it('should update intent when provided', async () => {
      const input = {
        tenantId: 'tenant-123',
        leadId: 'lead-123',
        qualificationScore: 75,
        classification: LeadClassification.YELLOW,
        sentiment: SentimentType.NEUTRAL,
        aiSummary: 'Medium quality lead',
        aiNotes: 'Needs follow-up',
        intent: 'Inquiry',
      };

      const result = await useCase.execute(input);

      expect(result.isSuccess).toBe(true);
      expect(mockLead.updateIntent).toHaveBeenCalledWith(
        'Inquiry',
        'Medium quality lead',
        'Needs follow-up',
      );
    });
  });
});
