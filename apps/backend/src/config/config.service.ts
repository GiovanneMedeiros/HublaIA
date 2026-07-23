import { Injectable } from '@nestjs/common';

/**
 * Configuração centralizada da aplicação
 */
@Injectable()
export class ConfigService {
  private readonly env = process.env;

  // Application
  get nodeEnv(): string {
    return this.env.NODE_ENV || 'development';
  }

  get port(): number {
    return parseInt(this.env.PORT || '3333', 10);
  }

  get apiUrl(): string {
    return this.env.API_URL || `http://localhost:${this.port}`;
  }

  get frontendUrl(): string {
    return this.env.FRONTEND_URL || 'http://localhost:3000';
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  // Database
  get databaseUrl(): string {
    const url = this.env.DATABASE_URL;
    if (!url) {
      throw new Error('DATABASE_URL não configurada');
    }
    return url;
  }

  // JWT
  get jwtSecret(): string {
    const secret = this.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET não configurada');
    }
    return secret;
  }

  get jwtExpiration(): string {
    return this.env.JWT_EXPIRATION || '1h';
  }

  get jwtRefreshSecret(): string {
    const secret = this.env.JWT_REFRESH_SECRET;
    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET não configurada');
    }
    return secret;
  }

  get jwtRefreshExpiration(): string {
    return this.env.JWT_REFRESH_EXPIRATION || '7d';
  }

  // Google OAuth
  get googleClientId(): string {
    return this.env.GOOGLE_CLIENT_ID || '';
  }

  get googleClientSecret(): string {
    return this.env.GOOGLE_CLIENT_SECRET || '';
  }

  get googleCallbackUrl(): string {
    return this.env.GOOGLE_CALLBACK_URL || `http://localhost:${this.port}/api/auth/google/callback`;
  }

  // Redis
  get redisHost(): string {
    return this.env.REDIS_HOST || 'localhost';
  }

  get redisPort(): number {
    return parseInt(this.env.REDIS_PORT || '6379', 10);
  }

  get redisPassword(): string | undefined {
    return this.env.REDIS_PASSWORD;
  }

  // WhatsApp
  get whatsappBusinessAccountId(): string {
    const id = this.env.WHATSAPP_BUSINESS_ACCOUNT_ID;
    if (!id && this.isProduction) {
      throw new Error('WHATSAPP_BUSINESS_ACCOUNT_ID não configurada');
    }
    return id || '';
  }

  get whatsappAccessToken(): string {
    const token = this.env.WHATSAPP_ACCESS_TOKEN;
    if (!token && this.isProduction) {
      throw new Error('WHATSAPP_ACCESS_TOKEN não configurada');
    }
    return token || '';
  }

  get whatsappWebhookVerifyToken(): string {
    const token = this.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;
    if (!token && this.isProduction) {
      throw new Error('WHATSAPP_WEBHOOK_VERIFY_TOKEN não configurada');
    }
    return token || '';
  }

  // OpenAI
  get openaiApiKey(): string {
    const key = this.env.OPENAI_API_KEY;
    if (!key && this.isProduction) {
      throw new Error('OPENAI_API_KEY não configurada');
    }
    return key || '';
  }

  get openaiModel(): string {
    return this.env.OPENAI_MODEL || 'gpt-4-turbo';
  }

  get openaiMaxTokens(): number {
    return parseInt(this.env.OPENAI_MAX_TOKENS || '2000', 10);
  }

  get openaiTemperature(): number {
    return parseFloat(this.env.OPENAI_TEMPERATURE || '0.7');
  }

  // SMTP
  get smtpHost(): string {
    return this.env.SMTP_HOST || 'smtp.gmail.com';
  }

  get smtpPort(): number {
    return parseInt(this.env.SMTP_PORT || '587', 10);
  }

  get smtpUser(): string {
    return this.env.SMTP_USER || '';
  }

  get smtpPassword(): string {
    return this.env.SMTP_PASSWORD || '';
  }

  get smtpFrom(): string {
    return this.env.SMTP_FROM || 'noreply@hublaia.com';
  }

  // Logging
  get logLevel(): string {
    return this.env.LOG_LEVEL || (this.isDevelopment ? 'debug' : 'info');
  }

  get logFormat(): string {
    return this.env.LOG_FORMAT || 'json';
  }
}
