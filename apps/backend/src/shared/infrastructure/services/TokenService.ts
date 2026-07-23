import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ITokenService, IJWTPayload } from '@shared/types';

/**
 * Serviço de geração e validação de JWT tokens
 */
@Injectable()
export class TokenService implements ITokenService {
  constructor(
    private jwtSecret: string,
    private jwtExpiration: string,
    private jwtRefreshSecret: string,
    private jwtRefreshExpiration: string
  ) {}

  generateAccessToken(payload: any, expiresIn?: string): string {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: (expiresIn || this.jwtExpiration) as any,
      algorithm: 'HS256',
    });
  }

  generateRefreshToken(payload: any, expiresIn?: string): string {
    return jwt.sign(payload, this.jwtRefreshSecret, {
      expiresIn: (expiresIn || this.jwtRefreshExpiration) as any,
      algorithm: 'HS256',
    });
  }

  verifyAccessToken(token: string): IJWTPayload {
    try {
      const decoded = jwt.verify(token, this.jwtSecret, {
        algorithms: ['HS256'],
      }) as IJWTPayload;
      return decoded;
    } catch (error) {
      throw new Error('Token de acesso inválido ou expirado');
    }
  }

  verifyRefreshToken(token: string): IJWTPayload {
    try {
      const decoded = jwt.verify(token, this.jwtRefreshSecret, {
        algorithms: ['HS256'],
      }) as IJWTPayload;
      return decoded;
    } catch (error) {
      throw new Error('Refresh token inválido ou expirado');
    }
  }

  decodeToken(token: string): any {
    return jwt.decode(token);
  }
}
