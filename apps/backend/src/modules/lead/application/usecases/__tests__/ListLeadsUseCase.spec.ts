/**
 * Tests for ListLeadsUseCase
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ListLeadsUseCase } from '../ListLeadsUseCase';
import { ILeadRepository } from '../../../domain/ILeadRepository';
import { Result } from '@shared/domain/Result';
import { LeadStatus, LeadClassification } from '@shared/domain/enums';

describe('ListLeadsUseCase', () => {
  let useCase: ListLeadsUseCase;
  let leadRepository: ILeadRepository;

  const mockLeads = [
    {
      id: { toString: () => 'lead-1' },
      tenantId: 'tenant-123',
      name: 'Lead 1',
      status: LeadStatus.NEW,
    },
    {
      id: { toString: () => 'lead-2' },
      tenantId: 'tenant-123',
      name: 'Lead 2',
      status: LeadStatus.IN_QUEUE,
    },
  ];

  const mockLeadRepository = {
    findById: jest.fn(),
    findByPhone: jest.fn(),
    findByWhatsAppId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findByTenant: jest.fn().mockResolvedValue(
      Result.ok({
        data: mockLeads,
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      }),
    ),
    findUnassignedByTenant: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListLeadsUseCase,
        {
          provide: 'ILeadRepository',
          useValue: mockLeadRepository,
        },
      ],
    }).compile();

    useCase = module.get<ListLeadsUseCase>(ListLeadsUseCase);
    leadRepository = module.get<ILeadRepository>('ILeadRepository');

    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should list leads successfully', async () => {
      const input = {
        tenantId: 'tenant-123',
        page: 1,
        limit: 10,
      };

      const result = await useCase.execute(input);

      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toHaveProperty('data');
      expect(result.getValue()).toHaveProperty('total');
      expect(result.getValue()).toHaveProperty('page');
      expect(mockLeadRepository.findByTenant).toHaveBeenCalled();
    });

    it('should apply status filter', async () => {
      const input = {
        tenantId: 'tenant-123',
        page: 1,
        limit: 10,
        status: LeadStatus.NEW,
      };

      await useCase.execute(input);

      expect(mockLeadRepository.findByTenant).toHaveBeenCalledWith(
        'tenant-123',
        expect.objectContaining({ status: LeadStatus.NEW }),
        expect.any(Object),
      );
    });

    it('should apply classification filter', async () => {
      const input = {
        tenantId: 'tenant-123',
        page: 1,
        limit: 10,
        classification: LeadClassification.GREEN,
      };

      await useCase.execute(input);

      expect(mockLeadRepository.findByTenant).toHaveBeenCalledWith(
        'tenant-123',
        expect.objectContaining({ classification: LeadClassification.GREEN }),
        expect.any(Object),
      );
    });

    it('should respect max limit of 100', async () => {
      const input = {
        tenantId: 'tenant-123',
        page: 1,
        limit: 500,
      };

      await useCase.execute(input);

      expect(mockLeadRepository.findByTenant).toHaveBeenCalledWith(
        'tenant-123',
        expect.any(Object),
        expect.objectContaining({ limit: 100 }),
      );
    });

    it('should handle repository errors', async () => {
      mockLeadRepository.findByTenant.mockResolvedValueOnce(
        Result.fail('Database error'),
      );

      const input = {
        tenantId: 'tenant-123',
        page: 1,
        limit: 10,
      };

      const result = await useCase.execute(input);

      expect(result.isFailure).toBe(true);
    });
  });
});
