/**
 * Lead Domain - Repository Interfaces
 */

import { Lead } from './Lead';
import { Result } from '@shared/domain/Result';
import { IPaginatedResult, IPaginationOptions } from '@shared/types';
import { LeadStatus, LeadClassification } from '@shared/domain/enums';

export interface ILeadRepository {
  findById(id: string, tenantId: string): Promise<Result<Lead>>;
  findByPhone(phone: string, tenantId: string): Promise<Result<Lead>>;
  findByWhatsAppId(whatsappId: string, tenantId: string): Promise<Result<Lead>>;
  create(lead: Lead): Promise<Result<Lead>>;
  update(lead: Lead): Promise<Result<void>>;
  delete(id: string, tenantId: string): Promise<Result<void>>;
  findByTenant(
    tenantId: string,
    filters?: {
      status?: LeadStatus;
      classification?: LeadClassification;
      assignedToId?: string;
    },
    pagination?: IPaginationOptions
  ): Promise<Result<IPaginatedResult<Lead>>>;
  findUnassignedByTenant(
    tenantId: string,
    pagination?: IPaginationOptions
  ): Promise<Result<IPaginatedResult<Lead>>>;
}
