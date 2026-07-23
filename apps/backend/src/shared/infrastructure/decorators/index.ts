import { SetMetadata } from '@nestjs/common';

/**
 * Decorator para especificar quais roles podem acessar uma rota
 * Uso: @Roles('ADMIN', 'SECRETARY')
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

/**
 * Decorator para marcar uma rota como pública (sem autenticação)
 */
export const Public = () => SetMetadata('isPublic', true);

/**
 * Decorator para injetar o tenant do contexto
 */
export const CurrentTenant = () => {
  return (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) => {
    SetMetadata(`tenant-${parameterIndex}`, true)(
      target,
      propertyKey as any,
      parameterIndex as any
    );
  };
};
