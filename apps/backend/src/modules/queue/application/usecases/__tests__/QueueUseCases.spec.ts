/**
 * Tests for Queue Use Cases and Strategies
 */

import { Test, TestingModule } from '@nestjs/testing';
import { CreateQueueUseCase } from '../CreateQueueUseCase';
import { AddAgentToQueueUseCase } from '../AddAgentToQueueUseCase';
import { GetNextAgentUseCase } from '../GetNextAgentUseCase';
import { IQueueRepository, IQueueAssignmentRepository } from '../../../domain/IQueueRepository';
import { RoundRobinStrategy, FixedOrderStrategy } from '../../strategies/QueueStrategies';
import { Result } from '@shared/domain/Result';
import { QueueStrategy } from '@shared/domain/enums';

describe('Queue Use Cases', () => {
  let createQueueUseCase: CreateQueueUseCase;
  let addAgentToQueueUseCase: AddAgentToQueueUseCase;
  let getNextAgentUseCase: GetNextAgentUseCase;

  const mockQueueRepository = {
    findById: jest.fn(),
    findByName: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findByTenant: jest.fn(),
    findByDepartment: jest.fn(),
  };

  const mockAssignmentRepository = {
    findById: jest.fn(),
    findByQueueAndAgent: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findByQueue: jest.fn(),
    findActiveByQueue: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateQueueUseCase,
        AddAgentToQueueUseCase,
        GetNextAgentUseCase,
        {
          provide: 'IQueueRepository',
          useValue: mockQueueRepository,
        },
        {
          provide: 'IQueueAssignmentRepository',
          useValue: mockAssignmentRepository,
        },
      ],
    }).compile();

    createQueueUseCase = module.get<CreateQueueUseCase>(CreateQueueUseCase);
    addAgentToQueueUseCase = module.get<AddAgentToQueueUseCase>(
      AddAgentToQueueUseCase,
    );
    getNextAgentUseCase = module.get<GetNextAgentUseCase>(GetNextAgentUseCase);

    jest.clearAllMocks();
  });

  describe('CreateQueueUseCase', () => {
    it('should create a queue', async () => {
      const input = {
        tenantId: 'tenant-123',
        name: 'Sales Queue',
        strategy: QueueStrategy.ROUND_ROBIN,
      };

      mockQueueRepository.create.mockResolvedValueOnce(Result.ok(input));

      const result = await createQueueUseCase.execute(input);

      expect(result.isSuccess).toBe(true);
      expect(mockQueueRepository.create).toHaveBeenCalled();
    });

    it('should fail with empty name', async () => {
      const input = {
        tenantId: 'tenant-123',
        name: '',
        strategy: QueueStrategy.ROUND_ROBIN,
      };

      const result = await createQueueUseCase.execute(input);

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Nome');
    });
  });

  describe('AddAgentToQueueUseCase', () => {
    it('should add agent to queue', async () => {
      const mockQueue = {
        id: { toString: () => 'queue-123' },
        tenantId: 'tenant-123',
      };

      mockQueueRepository.findById.mockResolvedValueOnce(Result.ok(mockQueue));
      mockAssignmentRepository.findByQueueAndAgent.mockResolvedValueOnce(
        Result.fail('Not found'),
      );
      mockAssignmentRepository.create.mockResolvedValueOnce(
        Result.ok({ id: 'assignment-123' }),
      );

      const input = {
        tenantId: 'tenant-123',
        queueId: 'queue-123',
        agentId: 'agent-123',
        order: 1,
      };

      const result = await addAgentToQueueUseCase.execute(input);

      expect(result.isSuccess).toBe(true);
      expect(mockAssignmentRepository.create).toHaveBeenCalled();
    });

    it('should fail if agent already in queue', async () => {
      const mockQueue = {
        id: { toString: () => 'queue-123' },
        tenantId: 'tenant-123',
      };

      mockQueueRepository.findById.mockResolvedValueOnce(Result.ok(mockQueue));
      mockAssignmentRepository.findByQueueAndAgent.mockResolvedValueOnce(
        Result.ok({ id: 'assignment-existing' }),
      );

      const input = {
        tenantId: 'tenant-123',
        queueId: 'queue-123',
        agentId: 'agent-123',
        order: 1,
      };

      const result = await addAgentToQueueUseCase.execute(input);

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('já está na fila');
    });
  });

  describe('Queue Distribution Strategies', () => {
    describe('RoundRobinStrategy', () => {
      it('should rotate through agents', async () => {
        const strategy = new RoundRobinStrategy();

        const mockAssignments = [
          { agentId: 'agent-1', isActive: true, order: 0 },
          { agentId: 'agent-2', isActive: true, order: 1 },
          { agentId: 'agent-3', isActive: true, order: 2 },
        ];

        const result1 = await strategy.selectAgent(mockAssignments);
        const result2 = await strategy.selectAgent(mockAssignments);
        const result3 = await strategy.selectAgent(mockAssignments);

        expect(result1.isSuccess).toBe(true);
        expect(result2.isSuccess).toBe(true);
        expect(result3.isSuccess).toBe(true);

        // Each call should select different agent
        expect(result1.getValue()).not.toBe(result2.getValue());
      });

      it('should skip inactive agents', async () => {
        const strategy = new RoundRobinStrategy();

        const mockAssignments = [
          { agentId: 'agent-1', isActive: false, order: 0 },
          { agentId: 'agent-2', isActive: true, order: 1 },
        ];

        const result = await strategy.selectAgent(mockAssignments);

        expect(result.isSuccess).toBe(true);
        expect(result.getValue()).toBe('agent-2');
      });

      it('should fail when no agents available', async () => {
        const strategy = new RoundRobinStrategy();
        const result = await strategy.selectAgent([]);

        expect(result.isFailure).toBe(true);
      });
    });

    describe('FixedOrderStrategy', () => {
      it('should select first available agent', async () => {
        const strategy = new FixedOrderStrategy();

        const mockAssignments = [
          { agentId: 'agent-1', isActive: false, order: 0 },
          { agentId: 'agent-2', isActive: true, order: 1 },
          { agentId: 'agent-3', isActive: true, order: 2 },
        ];

        const result = await strategy.selectAgent(mockAssignments);

        expect(result.isSuccess).toBe(true);
        expect(result.getValue()).toBe('agent-2');
      });

      it('should respect order field', async () => {
        const strategy = new FixedOrderStrategy();

        const mockAssignments = [
          { agentId: 'agent-3', isActive: true, order: 3 },
          { agentId: 'agent-1', isActive: true, order: 1 },
          { agentId: 'agent-2', isActive: true, order: 2 },
        ];

        const result = await strategy.selectAgent(mockAssignments);

        expect(result.getValue()).toBe('agent-1');
      });
    });
  });
});
