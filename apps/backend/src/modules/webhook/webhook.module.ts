/**
 * Webhook Module
 */

import { Module } from '@nestjs/common';
import { WebhookController } from './infrastructure/controllers/WebhookController';
import { ProcessWhatsAppMessageUseCase } from './application/usecases/ProcessWhatsAppMessageUseCase';
import { LeadModule } from '../lead/lead.module';

@Module({
  imports: [LeadModule],
  controllers: [WebhookController],
  providers: [ProcessWhatsAppMessageUseCase],
  exports: [ProcessWhatsAppMessageUseCase],
})
export class WebhookModule {}
