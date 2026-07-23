import { Module, Global } from '@nestjs/common';
import { PrismaService } from './database/PrismaService';
import { LoggerService } from './services/LoggerService';
import { EncryptionService } from './services/EncryptionService';
import { HashService } from './services/HashService';
import { OpenAIService } from './services/OpenAIService';
import { ConfigService } from '@config/config.service';
import { TenantContext } from './context/TenantContext';
import { TokenService } from './services/TokenService';
import { TenantModuleService } from './services/TenantModuleService';

/**
 * Módulo Global de Infraestrutura
 * Fornece serviços compartilhados para toda a aplicação
 */
@Global()
@Module({
  providers: [
    ConfigService,
    LoggerService,
    EncryptionService,
    HashService,
    OpenAIService,
    PrismaService,
    TenantContext,
    TenantModuleService,
    {
      provide: TokenService,
      useFactory: (configService: ConfigService) => {
        return new TokenService(
          configService.jwtSecret,
          configService.jwtExpiration,
          configService.jwtRefreshSecret,
          configService.jwtRefreshExpiration
        );
      },
      inject: [ConfigService],
    },
  ],
  exports: [
    ConfigService,
    LoggerService,
    EncryptionService,
    HashService,
    OpenAIService,
    PrismaService,
    TenantContext,
    TenantModuleService,
    TokenService,
  ],
})
export class InfrastructureModule {}
