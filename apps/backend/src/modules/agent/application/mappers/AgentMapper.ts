/**
 * Agent Application - Mapper
 */

import { Agent } from '../../domain/Agent';
import { AgentResponseDTO } from '../dtos/AgentDTOs';

export class AgentMapper {
  static toDTO(agent: Agent): AgentResponseDTO {
    return {
      id: agent.id.toString(),
      tenantId: agent.tenantId,
      userId: agent.userId,
      name: agent.name,
      title: agent.props.title,
      bio: agent.props.bio,
      status: agent.status,
      isAvailable: agent.isAvailable,
      currentConversations: agent.currentConversations,
      maxConcurrent: agent.props.maxConcurrent,
      specialties: agent.specialties,
      departmentId: agent.props.departmentId,
      totalLeads: agent.props.totalLeads,
      totalClosed: agent.props.totalClosed,
      averageRating: agent.props.averageRating,
      responseTime: agent.props.responseTime,
      createdAt: agent.props.createdAt,
    };
  }

  static toDTOArray(agents: Agent[]): AgentResponseDTO[] {
    return agents.map((agent) => this.toDTO(agent));
  }
}
