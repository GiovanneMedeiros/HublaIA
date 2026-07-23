import { Injectable, Scope } from '@nestjs/common';
import { ICurrentTenant } from '@shared/types';

/**
 * TenantContext fornece contexto de tenant para cada request
 * Escopo REQUEST significa uma nova instância por request
 */
@Injectable({ scope: Scope.REQUEST })
export class TenantContext {
  private currentTenant: ICurrentTenant | null = null;

  setTenant(tenant: ICurrentTenant): void {
    this.currentTenant = tenant;
  }

  getTenant(): ICurrentTenant {
    if (!this.currentTenant) {
      throw new Error('Tenant não configurado no contexto');
    }
    return this.currentTenant;
  }

  getTenantId(): string {
    return this.getTenant().id;
  }

  getUserId(): string {
    return this.getTenant().userId;
  }

  getUserRole(): string {
    return this.getTenant().userRole;
  }

  isAdmin(): boolean {
    return this.getTenant().userRole === 'ADMIN';
  }

  isAgent(): boolean {
    return this.getTenant().userRole === 'AGENT';
  }

  isSecretary(): boolean {
    return this.getTenant().userRole === 'SECRETARY';
  }

  hasTenant(): boolean {
    return this.currentTenant !== null;
  }
}
