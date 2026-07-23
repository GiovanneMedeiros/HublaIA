/**
 * Webhook Domain - WhatsApp Webhook Types
 */

export enum WebhookEventType {
  MESSAGE_RECEIVED = 'MESSAGE_RECEIVED',
  MESSAGE_SENT = 'MESSAGE_SENT',
  MESSAGE_FAILED = 'MESSAGE_FAILED',
  MESSAGE_READ = 'MESSAGE_READ',
  CONTACT_CHANGED = 'CONTACT_CHANGED',
}

export interface IWebhookPayload {
  event: WebhookEventType;
  tenantId: string;
  externalId: string;
  data: Record<string, any>;
  timestamp: Date;
}

export interface WhatsAppMessagePayload {
  tenantId: string;
  senderPhoneNumber: string;
  senderName?: string;
  messageText: string;
  messageId: string;
  timestamp: Date;
  attachments?: WhatsAppAttachment[];
}

export interface WhatsAppAttachment {
  type: 'image' | 'document' | 'audio' | 'video';
  url: string;
  fileName?: string;
  mimeType?: string;
}
