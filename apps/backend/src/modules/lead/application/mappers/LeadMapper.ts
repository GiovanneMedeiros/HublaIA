/**
 * Lead Application - Mappers
 */

import { Lead } from '../../domain/Lead';
import { LeadResponseDTO } from '../dtos/LeadDTOs';

export class LeadMapper {
  static toDTO(lead: Lead): LeadResponseDTO {
    return {
      id: lead.id.toString(),
      tenantId: lead.tenantId,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      whatsappId: lead.whatsappId,
      status: lead.status,
      classification: lead.classification,
      qualificationScore: lead.qualificationScore,
      sentiment: lead.sentiment,
      assignedToId: lead.assignedToId,
      queueId: lead.queueId,
      source: lead.props.source,
      tags: lead.props.tags,
      customFields: lead.props.customFields,
      aiSummary: lead.aiSummary,
      intent: lead.intent,
      createdAt: lead.props.createdAt,
      updatedAt: lead.props.lastMessageAt,
    };
  }

  static toDTOArray(leads: Lead[]): LeadResponseDTO[] {
    return leads.map((lead) => this.toDTO(lead));
  }
}
