import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRED_MODULE_KEY } from '../decorators/RequireModule';
import { TenantModuleService } from '../services/TenantModuleService';

@Injectable()
export class ModuleAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tenantModuleService: TenantModuleService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredModule = this.reflector.getAllAndOverride<string>(REQUIRED_MODULE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredModule) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const tenantId = request?.tenant?.id;

    if (!tenantId) {
      throw new ForbiddenException('Tenant não encontrado para validar módulo');
    }

    const enabled = await this.tenantModuleService.isModuleEnabled(tenantId, requiredModule);

    if (!enabled) {
      throw new ForbiddenException(`Módulo ${requiredModule} não está habilitado para este tenant`);
    }

    return true;
  }
}
