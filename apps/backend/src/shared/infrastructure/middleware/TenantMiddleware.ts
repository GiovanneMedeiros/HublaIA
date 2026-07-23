import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantContext } from '../context/TenantContext';
import { TokenService } from '../services/TokenService';
import { IJWTPayload } from '@shared/types';

/**
 * Middleware responsável por extrair e validar tenant ID do JWT
 * Executa em toda request autenticada
 */
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(
    private tenantContext: TenantContext,
    private tokenService: TokenService
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = this.extractToken(req.headers.authorization, req.headers.cookie);

      if (!token) {
        return next();
      }
      const payload = this.tokenService.verifyAccessToken(token) as IJWTPayload;

      // Carregar tenant no contexto
      this.tenantContext.setTenant({
        id: payload.tenantId,
        userId: payload.sub,
        userRole: payload.role,
      });

      // Adicionar ao request object para fácil acesso
      (req as any).tenant = {
        id: payload.tenantId,
        userId: payload.sub,
        userRole: payload.role,
      };
      (req as any).user = payload;

      next();
    } catch (error) {
      // Token inválido ou não fornecido - deixar continuar
      // Guards de autorização tratarão isto
      next();
    }
  }

  private extractToken(authorization?: string, cookieHeader?: string): string | null {
    if (authorization?.startsWith('Bearer ')) {
      return authorization.substring(7);
    }

    if (!cookieHeader) {
      return null;
    }

    const cookie = cookieHeader
      .split(';')
      .map((item) => item.trim())
      .find((item) => item.startsWith('hublaia_access_token='));

    return cookie ? decodeURIComponent(cookie.split('=')[1] || '') : null;
  }
}
