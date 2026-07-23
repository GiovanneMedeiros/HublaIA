/**
 * Lead Domain - Message Entity
 */

import { Entity } from '@shared/domain/Entity';
import { UniqueEntityID } from '@shared/domain/UniqueEntityID';

interface MessageProps {
  conversationId: string;
  tenantId: string;
  senderType: 'AI' | 'AGENT' | 'CLIENT';
  senderId?: string; // Agent ID if senderType is AGENT
  content: string;
  contentType: string; // text, image, file
  attachments?: string[];
  aiAnalysis?: {
    sentiment: string;
    intent: string;
    keywords: string[];
    entities: Record<string, any>;
  };
  isRead: boolean;
  externalId?: string; // WhatsApp message ID
  createdAt: Date;
}

export class Message extends Entity<MessageProps> {
  private constructor(props: MessageProps, id?: UniqueEntityID) {
    super(props, id);
  }

  static create(props: Omit<MessageProps, 'createdAt'>, id?: UniqueEntityID): Message {
    return new Message(
      {
        ...props,
        createdAt: new Date(),
      },
      id
    );
  }

  get conversationId(): string {
    return this.props.conversationId;
  }

  get senderType(): 'AI' | 'AGENT' | 'CLIENT' {
    return this.props.senderType;
  }

  get content(): string {
    return this.props.content;
  }

  get sentiment(): string | undefined {
    return this.props.aiAnalysis?.sentiment;
  }

  get intent(): string | undefined {
    return this.props.aiAnalysis?.intent;
  }

  markAsRead(): void {
    this.props.isRead = true;
  }

  validate(): boolean {
    return this.props.content && this.props.content.length > 0;
  }
}
