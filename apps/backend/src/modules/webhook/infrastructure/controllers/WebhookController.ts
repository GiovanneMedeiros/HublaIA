/**
 * Webhook Controller - Endpoints for external integrations
 */

import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { Public } from '@shared/infrastructure/decorators/Public';
import { ProcessWhatsAppMessageUseCase } from '../../application/usecases/ProcessWhatsAppMessageUseCase';
import { WhatsAppMessagePayload } from '../../domain/WebhookTypes';

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly processWhatsAppMessageUseCase: ProcessWhatsAppMessageUseCase) {}

  @Post('whatsapp')
  @Public()
  @HttpCode(HttpStatus.OK)
  async handleWhatsAppWebhook(@Body() payload: WhatsAppMessagePayload): Promise<any> {
    const result = await this.processWhatsAppMessageUseCase.execute(payload);

    if (result.isFailure) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      data: result.getValue(),
    };
  }

  // Webhook para verificação do WhatsApp Business API
  @Post('whatsapp/verify')
  @Public()
  @HttpCode(HttpStatus.OK)
  async verifyWhatsAppWebhook(): Promise<any> {
    // Implementação do webhook de verificação
    return { success: true };
  }
}
