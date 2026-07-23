import { Injectable, Logger } from '@nestjs/common';
import { ILogger } from '@shared/types';

/**
 * Serviço de logging centralizado
 * Implementa padrão de logs estruturados em JSON
 */
@Injectable()
export class LoggerService implements ILogger {
  private logger = new Logger();

  log(message: string, context?: string, metadata?: any): void {
    const logEntry = {
      level: 'INFO',
      message,
      context,
      metadata,
      timestamp: new Date().toISOString(),
    };
    this.logger.log(JSON.stringify(logEntry));
  }

  error(message: string, trace?: string, context?: string, metadata?: any): void {
    const logEntry = {
      level: 'ERROR',
      message,
      trace,
      context,
      metadata,
      timestamp: new Date().toISOString(),
    };
    this.logger.error(JSON.stringify(logEntry));
  }

  warn(message: string, context?: string, metadata?: any): void {
    const logEntry = {
      level: 'WARN',
      message,
      context,
      metadata,
      timestamp: new Date().toISOString(),
    };
    this.logger.warn(JSON.stringify(logEntry));
  }

  debug(message: string, context?: string, metadata?: any): void {
    const logEntry = {
      level: 'DEBUG',
      message,
      context,
      metadata,
      timestamp: new Date().toISOString(),
    };
    this.logger.debug(JSON.stringify(logEntry));
  }
}
