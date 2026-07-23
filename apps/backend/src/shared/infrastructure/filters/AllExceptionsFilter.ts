import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainError } from '@shared/domain/errors/DomainError';

/**
 * Filtro global de exceções
 * Padroniza todas as respostas de erro da API
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Erro interno do servidor';
    let code = 'INTERNAL_ERROR';
    let details: any = null;

    // Domain Error
    if (exception instanceof DomainError) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
      code = exception.code;
    }
    // HTTP Exception
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();

      if (typeof errorResponse === 'object') {
        message = (errorResponse as any).message || exception.message;
        code = (errorResponse as any).error || 'HTTP_ERROR';
        details = (errorResponse as any).details;
      } else {
        message = errorResponse as string;
      }
    }
    // Unexpected Error
    else if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
      message = exception.message || 'Erro inesperado';
    }

    const errorResponse = {
      success: false,
      error: {
        code,
        message,
        details,
      },
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }
}
