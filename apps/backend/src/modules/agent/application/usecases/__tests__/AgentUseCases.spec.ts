/**
 * Tests for Agent Use Cases
 */

import { Test, TestingModule } from '@nestjs/testing';
import { CreateAgentUseCase } from '../CreateAgentUseCase';
import { UpdateAgentAvailabilityUseCase } from '../UpdateAgentAvailabilityUseCase';
import { ListAgentsUseCase } from '../ListAgentsUseCase';
import { IAgentRepository } from '../../../domain/IAgentRepository';
import { Result } from '@shared/domain/Result';
import { AgentStatus } from '@shared/domain/enums';

describe('Agent Use Cases', () => {
  let createAgentUseCase: CreateAgentUseCase;
  let updateAvailabilityUseCase: UpdateAgentAvailabilityUseCase;
  let listAgentsUseCase: ListAgentsUseCase;

  const mockAgentRepository = {
    findById: jest.fn(),
    findByUserId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findByTenant: jest.fn(),
    findAvailableByTenant: jest.fn(),
    findByDepartment: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateAgentUseCase,
        UpdateAgentAvailabilityUseCase,
        ListAgentsUseCase,
        {
          provide: 'IAgentRepository',
          useValue: mockAgentRepository,
        },
      ],
    }).compile();

    createAgentUseCase = module.get<CreateAgentUseCase>(CreateAgentUseCase);
    updateAvailabilityUseCase = module.get<UpdateAgentAvailabilityUseCase>(
      UpdateAgentAvailabilityUseCase,
    );
    listAgentsUseCase = module.get<ListAgentsUseCase>(ListAgentsUseCase);

    jest.clearAllMocks();
  });

  describe('CreateAgentUseCase', () => {
    it('should create an agent successfully', async () => {
      const input = {
        tenantId: 'tenant-123',
        userId: 'user-123',
        name: 'John Agent',
        title: 'Sales Agent',
        specialties: ['Real Estate'],
      };

      mockAgentRepository.create.mockResolvedValueOnce(Result.ok(input));

      const result = await createAgentUseCase.execute(input);

      expect(result.isSuccess).toBe(true);
      expect(mockAgentRepository.create).toHaveBeenCalled();
    });

    it('should fail with empty name', async () => {
      const input = {
        tenantId: 'tenant-123',
        userId: 'user-123',
        name: '',
        title: 'Sales Agent',
      };

      const result = await createAgentUseCase.execute(input);

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Nome');
    });
  });

  describe('UpdateAgentAvailabilityUseCase', () => {
    it('should update agent availability', async () => {
      const mockAgent = {
        id: { getValue: 'agent-123' },
        tenantId: 'tenant-123',
        isAvailable: false,
        status: AgentStatus.AWAY,
        setAvailability: jest.fn(),
        props: {},
      };

      mockAgentRepository.findById.mockResolvedValueOnce(Result.ok(mockAgent));
      mockAgentRepository.update.mockResolvedValueOnce(Result.ok());

      const input = {
        tenantId: 'tenant-123',
        agentId: 'agent-123',
        isAvailable: true,
      };

      const result = await updateAvailabilityUseCase.execute(input);

      expect(result.isSuccess).toBe(true);
      expect(mockAgent.setAvailability).toHaveBeenCalledWith(true);
    });

    it('should fail when agent not found', async () => {
      mockAgentRepository.findById.mockResolvedValueOnce(
        Result.fail('Agent not found'),
      );

      const input = {
        tenantId: 'tenant-123',
        agentId: 'nonexistent',
        isAvailable: true,
      };

      const result = await updateAvailabilityUseCase.execute(input);

      expect(result.isFailure).toBe(true);
    });
  });

  describe('ListAgentsUseCase', () => {
    it('should list all agents', async () => {
      const mockAgents = {
        data: [
          { id: 'agent-1', name: 'Agent 1' },
          { id: 'agent-2', name: 'Agent 2' },
        ],
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      mockAgentRepository.findByTenant.mockResolvedValueOnce(
        Result.ok(mockAgents),
      );

      const input = {
        tenantId: 'tenant-123',
        page: 1,
        limit: 10,
      };

      const result = await listAgentsUseCase.execute(input);

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().data).toHaveLength(2);
    });

    it('should filter available agents', async () => {
      mockAgentRepository.findAvailableByTenant.mockResolvedValueOnce(
        Result.ok({
          data: [{ id: 'agent-1', isAvailable: true }],
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        }),
      );

      const input = {
        tenantId: 'tenant-123',
        onlyAvailable: true,
        page: 1,
        limit: 10,
      };

      const result = await listAgentsUseCase.execute(input);

      expect(result.isSuccess).toBe(true);
      expect(mockAgentRepository.findAvailableByTenant).toHaveBeenCalled();
    });
  });
});
