/**
 * Tests for LeadController
 */

import { Test, TestingModule } from '@nestjs/testing';
import { LeadController } from '../LeadController';
import { CreateLeadUseCase } from '../../../application/usecases/CreateLeadUseCase';
import { QualifyLeadUseCase } from '../../../application/usecases/QualifyLeadUseCase';
import { AutoQualifyLeadUseCase } from '../../../application/usecases/AutoQualifyLeadUseCase';
import { AssignLeadToAgentUseCase } from '../../../application/usecases/AssignLeadToAgentUseCase';
import { GetLeadDetailsUseCase } from '../../../application/usecases/GetLeadDetailsUseCase';
import { ListLeadsUseCase } from '../../../application/usecases/ListLeadsUseCase';
import { Result } from '@shared/domain/Result';
import { JwtAuthGuard } from '@shared/infrastructure/guards/JwtAuthGuard';
import { TenantGuard } from '@shared/infrastructure/guards/TenantGuard';

describe('LeadController (E2E)', () => {
  let controller: LeadController;
  let createLeadUseCase: CreateLeadUseCase;
  let listLeadsUseCase: ListLeadsUseCase;

  const mockUseCases = {
    create: jest.fn(),
    qualify: jest.fn(),
    autoQualify: jest.fn(),
    assign: jest.fn(),
    getDetails: jest.fn(),
    list: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeadController],
      providers: [
        {
          provide: JwtAuthGuard,
          useValue: { canActivate: jest.fn().mockReturnValue(true) },
        },
        {
          provide: TenantGuard,
          useValue: { canActivate: jest.fn().mockReturnValue(true) },
        },
        {
          provide: CreateLeadUseCase,
          useValue: mockUseCases.create,
        },
        {
          provide: QualifyLeadUseCase,
          useValue: mockUseCases.qualify,
        },
        {
          provide: AutoQualifyLeadUseCase,
          useValue: mockUseCases.autoQualify,
        },
        {
          provide: AssignLeadToAgentUseCase,
          useValue: mockUseCases.assign,
        },
        {
          provide: GetLeadDetailsUseCase,
          useValue: mockUseCases.getDetails,
        },
        {
          provide: ListLeadsUseCase,
          useValue: mockUseCases.list,
        },
      ],
    }).compile();

    controller = module.get<LeadController>(LeadController);
    jest.clearAllMocks();
  });

  describe('POST /leads', () => {
    it('should create a lead and return 201', async () => {
      const createDto = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+5511999999999',
        whatsappId: 'whatsapp-123',
        source: 'WHATSAPP',
      };

      mockUseCases.create.mockResolvedValueOnce(
        Result.ok({
          id: 'lead-123',
          name: 'John Doe',
          status: 'NEW',
        }),
      );

      const response = await controller.create(createDto as any, {
        tenant: { id: 'tenant-123' },
      } as any);

      expect(response.success).toBe(true);
      expect(response.data).toHaveProperty('id');
      expect(response.data.name).toBe('John Doe');
    });

    it('should return error on creation failure', async () => {
      const createDto = {
        name: '',
        email: 'john@example.com',
        phone: '+5511999999999',
        whatsappId: 'whatsapp-123',
        source: 'WHATSAPP',
      };

      mockUseCases.create.mockResolvedValueOnce(
        Result.fail('Invalid name'),
      );

      const response = await controller.create(createDto as any, {
        tenant: { id: 'tenant-123' },
      } as any);

      expect(response.success).toBe(false);
      expect(response.error).toBeDefined();
    });
  });

  describe('GET /leads', () => {
    it('should list leads with pagination', async () => {
      mockUseCases.list.mockResolvedValueOnce(
        Result.ok({
          data: [
            { id: 'lead-1', name: 'Lead 1' },
            { id: 'lead-2', name: 'Lead 2' },
          ],
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
        }),
      );

      const response = await controller.list(
        { page: 1, limit: 10 },
        { tenant: { id: 'tenant-123' } } as any,
      );

      expect(response.success).toBe(true);
      expect(response.data.data).toHaveLength(2);
      expect(response.data.total).toBe(2);
    });
  });

  describe('GET /leads/:id', () => {
    it('should return lead details', async () => {
      mockUseCases.getDetails.mockResolvedValueOnce(
        Result.ok({
          id: 'lead-123',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+5511999999999',
        }),
      );

      const response = await controller.getById('lead-123', {
        tenant: { id: 'tenant-123' },
      } as any);

      expect(response.success).toBe(true);
      expect(response.data.name).toBe('John Doe');
    });

    it('should return 404 when lead not found', async () => {
      mockUseCases.getDetails.mockResolvedValueOnce(
        Result.fail('Lead not found'),
      );

      const response = await controller.getById('nonexistent', {
        tenant: { id: 'tenant-123' },
      } as any);

      expect(response.success).toBe(false);
      expect(response.error.code).toBe('LEAD_NOT_FOUND');
    });
  });

  describe('PUT /leads/:id/qualify', () => {
    it('should qualify a lead', async () => {
      const qualifyDto = {
        qualificationScore: 85,
        classification: 'GREEN',
        sentiment: 'POSITIVE',
        aiSummary: 'High quality',
        aiNotes: 'Good prospect',
        intent: 'Purchase',
      };

      mockUseCases.qualify.mockResolvedValueOnce(
        Result.ok({
          id: 'lead-123',
          qualificationScore: 85,
          classification: 'GREEN',
        }),
      );

      const response = await controller.qualify(
        'lead-123',
        qualifyDto,
        'tenant-123',
      );

      expect(response.success).toBe(true);
      expect(response.data.qualificationScore).toBe(85);
    });
  });

  describe('POST /leads/:id/auto-qualify', () => {
    it('should auto-qualify a lead with AI', async () => {
      mockUseCases.autoQualify.mockResolvedValueOnce(
        Result.ok({
          id: 'lead-123',
          qualificationScore: 75,
          classification: 'YELLOW',
          sentiment: 'NEUTRAL',
        }),
      );

      const response = await controller.autoQualify('lead-123', 'tenant-123');

      expect(response.success).toBe(true);
      expect(response.data.qualificationScore).toBe(75);
    });
  });

  describe('PUT /leads/:id/assign', () => {
    it('should assign lead to agent', async () => {
      const assignDto = {
        agentId: 'agent-123',
      };

      mockUseCases.assign.mockResolvedValueOnce(
        Result.ok({
          id: 'lead-123',
          assignedToId: 'agent-123',
          status: 'WITH_AGENT',
        }),
      );

      const response = await controller.assignToAgent(
        'lead-123',
        assignDto,
        'tenant-123',
      );

      expect(response.success).toBe(true);
      expect(response.data.status).toBe('WITH_AGENT');
    });
  });
});
