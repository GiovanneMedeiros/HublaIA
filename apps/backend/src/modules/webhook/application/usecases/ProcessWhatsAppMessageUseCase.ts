/**
 * Webhook Use Case - Process WhatsApp Message
 */

import { Injectable } from '@nestjs/common';
import { IUseCase } from '@shared/domain/IUseCase';
import { Result } from '@shared/domain/Result';
import { Inject } from '@nestjs/common';
import { WhatsAppMessagePayload } from '../../domain/WebhookTypes';

interface ProcessWhatsAppMessageRequest extends WhatsAppMessagePayload {}

interface ProcessWhatsAppMessageResponse {
  leadId: string;
  messageId: string;
  processed: boolean;
}

@Injectable()
export class ProcessWhatsAppMessageUseCase implements IUseCase<
  ProcessWhatsAppMessageRequest,
  Result<ProcessWhatsAppMessageResponse>
> {
  constructor(@Inject('ILeadRepository') private leadRepository: any) {}

  async execute(
    request: ProcessWhatsAppMessageRequest
  ): Promise<Result<ProcessWhatsAppMessageResponse>> {
    // 1. Buscar lead pelo número de telefone WhatsApp
    const existingLead = await this.leadRepository.findByPhone(
      request.senderPhoneNumber,
      request.tenantId
    );

    let leadId: string;

    if (existingLead.isSuccess) {
      // Lead já existe - atualizar mensagem
      const lead = existingLead.getValue();
      leadId = lead.id.toString();

      // Registrar mensagem
      // lead.recordMessage({...}) - será implementado
    } else {
      // Criar novo lead
      // const newLead = await this.createLeadUseCase.execute({...})
      // leadId = newLead.id
    }

    return Result.ok<ProcessWhatsAppMessageResponse>({
      leadId,
      messageId: request.messageId,
      processed: true,
    });
  }
}
