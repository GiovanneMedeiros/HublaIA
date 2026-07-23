import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Serviço de conexão com Prisma
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Banco de dados conectado com sucesso');
    } catch (error) {
      this.logger.warn(
        `Não foi possível conectar ao banco: ${error.message}. O servidor continuará rodando.`
      );
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
