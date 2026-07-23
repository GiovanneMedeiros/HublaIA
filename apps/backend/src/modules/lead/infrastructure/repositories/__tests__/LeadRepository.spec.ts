/**
 * Tests for LeadRepository
 */

import { Test, TestingModule } from '@nestjs/testing';
import { LeadRepository } from '../LeadRepository';
import { PrismaService } from '@shared/infrastructure/database/PrismaService';
import { Result } from '@shared/domain/Result';
import { LeadStatus } from '@shared/domain/enums';

describe('LeadRepository', () => {
  let repository: LeadRepository;
  let prismaService: PrismaService;

  const mockPrismaService = {
    lead: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<LeadRepository>(LeadRepository);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return a lead when found', async () => {
      const mockLead = {
        id: 'lead-123',
        tenantId: 'tenant-123',
        name: 'John Doe',
        phone: '+5511999999999',
        status: LeadStatus.NEW,
      };

      mockPrismaService.lead.findUnique.mockResolvedValueOnce(mockLead);

      const result = await repository.findById('lead-123', 'tenant-123');

      expect(result.isSuccess).toBe(true);
      expect(mockPrismaService.lead.findUnique).toHaveBeenCalledWith({
        where: { id: 'lead-123' },
      });
    });

    it('should fail when lead not found', async () => {
      mockPrismaService.lead.findUnique.mockResolvedValueOnce(null);

      const result = await repository.findById('nonexistent', 'tenant-123');

      expect(result.isFailure).toBe(true);
    });

    it('should fail when tenant mismatch', async () => {
      const mockLead = {
        id: 'lead-123',
        tenantId: 'different-tenant',
        name: 'John Doe',
      };

      mockPrismaService.lead.findUnique.mockResolvedValueOnce(mockLead);

      const result = await repository.findById('lead-123', 'tenant-123');

      expect(result.isFailure).toBe(true);
    });
  });

  describe('findByPhone', () => {
    it('should return a lead by phone', async () => {
      const mockLead = {
        id: 'lead-123',
        tenantId: 'tenant-123',
        phone: '+5511999999999',
        deletedAt: null,
      };

      mockPrismaService.lead.findFirst.mockResolvedValueOnce(mockLead);

      const result = await repository.findByPhone(
        '+5511999999999',
        'tenant-123',
      );

      expect(result.isSuccess).toBe(true);
      expect(mockPrismaService.lead.findFirst).toHaveBeenCalledWith({
        where: {
          tenantId: 'tenant-123',
          phone: '+5511999999999',
          deletedAt: null,
        },
      });
    });

    it('should fail when phone not found', async () => {
      mockPrismaService.lead.findFirst.mockResolvedValueOnce(null);

      const result = await repository.findByPhone(
        '+5511999999999',
        'tenant-123',
      );

      expect(result.isFailure).toBe(true);
    });
  });

  describe('create', () => {
    it('should create a lead', async () => {
      const mockNewLead = {
        id: 'new-lead-123',
        tenantId: 'tenant-123',
        name: 'New Lead',
      };

      mockPrismaService.lead.create.mockResolvedValueOnce(mockNewLead);

      const mockLead = {
        id: { getValue: 'new-lead-123' },
        tenantId: 'tenant-123',
        name: 'New Lead',
        email: 'new@example.com',
        phone: '+5511999999999',
        whatsappId: 'whatsapp-123',
        status: LeadStatus.NEW,
        classification: 'GRAY',
        qualificationScore: 0,
        sentiment: 'NEUTRAL',
        assignedToId: null,
        queueId: null,
        aiSummary: null,
        props: {
          source: 'WHATSAPP',
          tags: [],
          customFields: {},
        },
      };

      const result = await repository.create(mockLead);

      expect(result.isSuccess).toBe(true);
      expect(mockPrismaService.lead.create).toHaveBeenCalled();
    });

    it('should handle creation errors', async () => {
      mockPrismaService.lead.create.mockRejectedValueOnce(
        new Error('Database error'),
      );

      const mockLead = {
        id: { getValue: 'new-lead-123' },
        tenantId: 'tenant-123',
        name: 'New Lead',
      };

      const result = await repository.create(mockLead);

      expect(result.isFailure).toBe(true);
    });
  });

  describe('findByTenant', () => {
    it('should list leads with pagination', async () => {
      const mockLeads = [
        { id: 'lead-1', tenantId: 'tenant-123' },
        { id: 'lead-2', tenantId: 'tenant-123' },
      ];

      mockPrismaService.lead.findMany.mockResolvedValueOnce(mockLeads);
      mockPrismaService.lead.count.mockResolvedValueOnce(2);

      const result = await repository.findByTenant('tenant-123', {
        page: 1,
        limit: 10,
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toHaveProperty('data');
      expect(result.getValue().data).toHaveLength(2);
      expect(result.getValue()).toHaveProperty('total', 2);
      expect(result.getValue()).toHaveProperty('page', 1);
    });

    it('should apply status filter', async () => {
      mockPrismaService.lead.findMany.mockResolvedValueOnce([]);
      mockPrismaService.lead.count.mockResolvedValueOnce(0);

      await repository.findByTenant(
        'tenant-123',
        { status: LeadStatus.NEW },
        { page: 1, limit: 10 },
      );

      expect(mockPrismaService.lead.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: LeadStatus.NEW }),
        }),
      );
    });
  });
});
