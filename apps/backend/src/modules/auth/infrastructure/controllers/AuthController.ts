/**
 * Auth Controller
 */

import { Controller, Post, Body, HttpCode, HttpStatus, Get, Req, Res, Query } from '@nestjs/common';
import type { Request, Response } from 'express';
import { randomBytes } from 'crypto';
import { LoginUseCase } from '../../application/usecases/LoginUseCase';
import { GoogleAuthUseCase } from '../../application/usecases/GoogleAuthUseCase';
import { LoginDTO, AuthResponseDTO } from '../../application/dtos/AuthDTOs';
import { IApiResponse } from '@shared/types';
import { Public } from '@shared/infrastructure/decorators';
import { ConfigService } from '@config/config.service';

interface GoogleTokenResponse {
  access_token: string;
}

interface GoogleProfileResponse {
  email: string;
  given_name?: string;
  family_name?: string;
  name?: string;
  picture?: string;
  verified_email?: boolean;
}

interface GoogleExchangeDTO {
  code?: string;
  state?: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private loginUseCase: LoginUseCase,
    private googleAuthUseCase: GoogleAuthUseCase,
    private configService: ConfigService
  ) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDTO,
    @Res({ passthrough: true }) res: Response
  ): Promise<IApiResponse<AuthResponseDTO>> {
    const result = await this.loginUseCase.execute(dto);

    if (result.isFailure) {
      return {
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: result.error,
        },
        timestamp: new Date().toISOString(),
      };
    }

    const response = result.getValue();

    res.setHeader('Set-Cookie', [
      this.buildCookie('hublaia_access_token', response.accessToken, 60 * 60),
      this.buildCookie('hublaia_refresh_token', response.refreshToken, 60 * 60 * 24 * 7),
    ]);

    return {
      success: true,
      data: response,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('me')
  async me(@Req() req: Request): Promise<IApiResponse<AuthResponseDTO['user']>> {
    const user = (req as any).user;

    if (!user) {
      return {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Sessão não encontrada',
        },
        timestamp: new Date().toISOString(),
      };
    }

    return {
      success: true,
      data: {
        id: user.sub,
        email: user.email,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        role: user.role,
        tenantId: user.tenantId,
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Get('google')
  async googleAuth(@Res() res: Response): Promise<void> {
    if (!this.configService.googleClientId || !this.configService.googleClientSecret) {
      res.redirect(
        `${this.configService.frontendUrl}/auth/login?error=google_oauth_not_configured`
      );
      return;
    }

    const state = randomBytes(24).toString('hex');
    res.setHeader('Set-Cookie', this.buildCookie('google_oauth_state', state, 600));

    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    url.searchParams.set('client_id', this.configService.googleClientId);
    url.searchParams.set('redirect_uri', this.configService.googleCallbackUrl);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', 'openid email profile');
    url.searchParams.set('access_type', 'offline');
    url.searchParams.set('prompt', 'consent');
    url.searchParams.set('state', state);

    res.redirect(url.toString());
  }

  @Public()
  @Get('google/callback')
  async googleCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Query('code') code?: string,
    @Query('state') state?: string,
    @Query('error') error?: string
  ): Promise<void> {
    if (error) {
      res.redirect(
        `${this.configService.frontendUrl}/auth/login?error=${encodeURIComponent(error)}`
      );
      return;
    }

    const cookieHeader = req.headers.cookie || '';
    const cookieState = this.getCookieValue(cookieHeader, 'google_oauth_state');

    if (!code || !state || !cookieState || cookieState !== state) {
      res.redirect(`${this.configService.frontendUrl}/auth/login?error=google_oauth_state_invalid`);
      return;
    }

    try {
      await this.completeGoogleAuth(code, res);
      res.redirect(`${this.configService.frontendUrl}/auth/google/callback`);
    } catch (callbackError) {
      res.redirect(`${this.configService.frontendUrl}/auth/login?error=google_oauth_failed`);
    }
  }

  @Public()
  @Post('google/exchange')
  @HttpCode(HttpStatus.OK)
  async googleExchange(
    @Req() req: Request,
    @Body() body: GoogleExchangeDTO,
    @Res({ passthrough: true }) res: Response
  ): Promise<IApiResponse<null>> {
    const code = body.code;
    const state = body.state;

    const cookieHeader = req.headers.cookie || '';
    const cookieState = this.getCookieValue(cookieHeader, 'google_oauth_state');

    if (!code || !state || !cookieState || cookieState !== state) {
      return {
        success: false,
        error: {
          code: 'GOOGLE_OAUTH_STATE_INVALID',
          message: 'Falha na validação do login com Google',
        },
        timestamp: new Date().toISOString(),
      };
    }

    try {
      await this.completeGoogleAuth(code, res);

      return {
        success: true,
        data: null,
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        success: false,
        error: {
          code: 'GOOGLE_OAUTH_FAILED',
          message: 'Não foi possível concluir o login com Google',
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response): Promise<IApiResponse<null>> {
    res.setHeader('Set-Cookie', [
      this.buildCookie('hublaia_access_token', '', 0),
      this.buildCookie('hublaia_refresh_token', '', 0),
    ]);

    return {
      success: true,
      data: null,
      timestamp: new Date().toISOString(),
    };
  }

  private getCookieValue(cookieHeader: string, key: string): string | null {
    const cookie = cookieHeader
      .split(';')
      .map((item) => item.trim())
      .find((item) => item.startsWith(`${key}=`));

    return cookie ? decodeURIComponent(cookie.split('=')[1] || '') : null;
  }

  private async completeGoogleAuth(code: string, res: Response): Promise<void> {
    const tokens = await this.exchangeGoogleCode(code);
    const profile = await this.fetchGoogleProfile(tokens.access_token);
    const authResponse = await this.googleAuthUseCase.execute(profile);

    res.setHeader('Set-Cookie', [
      this.buildCookie('google_oauth_state', '', 0),
      this.buildCookie('hublaia_access_token', authResponse.accessToken, 60 * 60),
      this.buildCookie('hublaia_refresh_token', authResponse.refreshToken, 60 * 60 * 24 * 7),
    ]);
  }

  private buildCookie(name: string, value: string, maxAgeSeconds: number): string {
    const cookieParts = [
      `${name}=${encodeURIComponent(value)}`,
      'Path=/',
      'HttpOnly',
      'SameSite=Lax',
      `Max-Age=${maxAgeSeconds}`,
    ];

    if (this.configService.isProduction) {
      cookieParts.push('Secure');
    }

    return cookieParts.join('; ');
  }

  private async exchangeGoogleCode(code: string): Promise<GoogleTokenResponse> {
    const body = new URLSearchParams({
      code,
      client_id: this.configService.googleClientId,
      client_secret: this.configService.googleClientSecret,
      redirect_uri: this.configService.googleCallbackUrl,
      grant_type: 'authorization_code',
    });

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!response.ok) {
      throw new Error('Não foi possível trocar o código do Google');
    }

    return (await response.json()) as GoogleTokenResponse;
  }

  private async fetchGoogleProfile(accessToken: string): Promise<{
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    emailVerified?: boolean;
  }> {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Não foi possível obter o perfil do Google');
    }

    const profile = (await response.json()) as GoogleProfileResponse;

    return {
      email: profile.email,
      firstName: profile.given_name || profile.name?.split(' ')?.[0] || 'Usuário',
      lastName: profile.family_name || profile.name?.split(' ')?.slice(1).join(' ') || 'Google',
      avatar: profile.picture,
      emailVerified: profile.verified_email,
    };
  }
}
