import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenService } from '../services/TokenService';

/**
 * Guard que valida JWT em todas as rotas protegidas
 * Permite rotas marcadas com @Public()
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private reflector: Reflector
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // Verificar se a rota é pública
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request.headers.authorization, request.headers.cookie);

    if (!token) {
      throw new UnauthorizedException('Token não fornecido');
    }

    try {
      const payload = this.tokenService.verifyAccessToken(token);
      request.user = payload;
      request.tenant = {
        id: payload.tenantId,
        userId: payload.sub,
        userRole: payload.role,
      };
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

  private extractToken(authorization?: string, cookieHeader?: string): string | null {
    if (authorization) {
      const parts = authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        return parts[1];
      }
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
