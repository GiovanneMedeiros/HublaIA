/**
 * Tests for CreateLeadUseCase
 */

import { Test, TestingModule } from '@nestjs/testing';
import { CreateLeadUseCase } from '../CreateLeadUseCase';
import { ILeadRepository } from '../../../domain/ILeadRepository';
import { LeadResponseDTO } from '../../dtos/LeadDTOs';
import { Result } from '@shared/domain/Result';

describe('CreateLeadUseCase', () => {
  let useCase: CreateLeadUseCase;
  let leadRepository: ILeadRepository;

  const mockLeadRepository = {
    findById: jest.fn(),
    findByPhone: jest.fn(),
    findByWhatsAppId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findByTenant: jest.fn(),
    findUnassignedByTenant: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateLeadUseCase,
        {
          provide: 'ILeadRepository',
          useValue: mockLeadRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateLeadUseCase>(CreateLeadUseCase);
    leadRepository = module.get<ILeadRepository>('ILeadRepository');

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should create a lead successfully', async () => {
      const input = {
        tenantId: 'tenant-123',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+5511999999999',
        whatsappId: 'whatsapp-123',
      };

      mockLeadRepository.create.mockResolvedValueOnce(
        Result.ok({ id: 'lead-123' }),
      );

      const result = await useCase.execute(input);

      expect(result.isSuccess).toBe(true);
      expect(mockLeadRepository.create).toHaveBeenCalled();
    });

    it('should fail with empty name', async () => {
      const input = {
        tenantId: 'tenant-123',
        name: '',
        email: 'john@example.com',
        phone: '+5511999999999',
        whatsappId: 'whatsapp-123',
      };

      const result = await useCase.execute(input);

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('nome');
    });

    it('should fail with empty phone', async () => {
      const input = {
        tenantId: 'tenant-123',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '',
        whatsappId: 'whatsapp-123',
      };

      const result = await useCase.execute(input);

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('telefone');
    });

    it('should fail with invalid email format', async () => {
      const input = {
        tenantId: 'tenant-123',
        name: 'John Doe',
        email: 'invalid-email',
        phone: '+5511999999999',
        whatsappId: 'whatsapp-123',
      };

      const result = await useCase.execute(input);

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('email');
    });

    it('should handle repository errors gracefully', async () => {
      const input = {
        tenantId: 'tenant-123',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+5511999999999',
        whatsappId: 'whatsapp-123',
      };

      mockLeadRepository.create.mockResolvedValueOnce(
        Result.fail('Database error'),
      );

      const result = await useCase.execute(input);

      expect(result.isFailure).toBe(true);
    });
  });
});
