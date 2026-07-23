import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { TenantContext } from '../context/TenantContext';

/**
 * Guard que valida se o tenant ID é válido e corresponde ao usuário
 */
@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private tenantContext: TenantContext) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const tenant = request.tenant;

    if (!tenant || !tenant.id) {
      throw new UnauthorizedException('Tenant não configurado');
    }

    // Validar que o tenant ID está no JWT
    if (!request.user || request.user.tenantId !== tenant.id) {
      throw new UnauthorizedException('Tenant mismatch');
    }

    return true;
  }
}
