/**
 * Queue Application - Mappers
 */

import { Queue, QueueAssignment } from '../../domain/Queue';
import { QueueResponseDTO, QueueAssignmentResponseDTO } from '../dtos/QueueDTOs';

export class QueueMapper {
  static toDTO(queue: Queue): QueueResponseDTO {
    return {
      id: queue.id.toString(),
      tenantId: queue.tenantId,
      name: queue.name,
      description: queue.props.description,
      strategy: queue.strategy,
      departmentId: queue.props.departmentId,
      isActive: queue.isActive,
      maxRetries: queue.props.maxRetries,
      assignmentTimeout: queue.props.assignmentTimeout,
      createdAt: queue.props.createdAt,
    };
  }

  static toDTOArray(queues: Queue[]): QueueResponseDTO[] {
    return queues.map((queue) => this.toDTO(queue));
  }
}

export class QueueAssignmentMapper {
  static toDTO(assignment: QueueAssignment): QueueAssignmentResponseDTO {
    return {
      id: assignment.id.toString(),
      queueId: assignment.queueId,
      agentId: assignment.agentId,
      order: assignment.order,
      isActive: assignment.isActive,
    };
  }

  static toDTOArray(assignments: QueueAssignment[]): QueueAssignmentResponseDTO[] {
    return assignments.map((assignment) => this.toDTO(assignment));
  }
}
