/**
 * Queue Distribution Strategies
 */

import { QueueStrategy } from '@shared/domain/enums';
import { Result } from '@shared/domain/Result';
import { QueueAssignment } from '../../domain/Queue';

/**
 * Round Robin - Distribui equitativamente entre agentes
 */
export class RoundRobinStrategy {
  private lastAgentIndex = 0;

  async selectAgent(assignments: QueueAssignment[]): Promise<Result<string>> {
    if (assignments.length === 0) {
      return Result.fail<string>('Nenhum agente disponível');
    }

    const activeAssignments = assignments.filter((a) => a.isActive);
    if (activeAssignments.length === 0) {
      return Result.fail<string>('Nenhum agente ativo disponível');
    }

    // Rotacionar entre agentes
    const selected = activeAssignments[this.lastAgentIndex % activeAssignments.length];
    this.lastAgentIndex++;

    return Result.ok<string>(selected.agentId);
  }
}

/**
 * Fixed Order - Sempre o primeiro disponível
 */
export class FixedOrderStrategy {
  async selectAgent(assignments: QueueAssignment[]): Promise<Result<string>> {
    if (assignments.length === 0) {
      return Result.fail<string>('Nenhum agente disponível');
    }

    const sorted = assignments.sort((a, b) => a.order - b.order);
    const selected = sorted.find((a) => a.isActive);

    if (!selected) {
      return Result.fail<string>('Nenhum agente ativo disponível');
    }

    return Result.ok<string>(selected.agentId);
  }
}

/**
 * Factory para criar estratégias
 */
export class QueueStrategyFactory {
  static create(strategy: QueueStrategy): any {
    switch (strategy) {
      case QueueStrategy.ROUND_ROBIN:
        return new RoundRobinStrategy();
      case QueueStrategy.FIXED_ORDER:
        return new FixedOrderStrategy();
      // Próximas: SPECIALTY, DEPARTMENT, AVAILABILITY, PRIORITY
      default:
        return new RoundRobinStrategy();
    }
  }
}
