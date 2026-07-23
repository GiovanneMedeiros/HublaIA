/**
 * Lead Domain - Entidades e Agregado Raiz
 */

import { AggregateRoot } from '@shared/domain/AggregateRoot';
import { UniqueEntityID } from '@shared/domain/UniqueEntityID';
import { LeadStatus, LeadClassification, SentimentType } from '@shared/domain/enums';
import { Message } from './Message';

interface LeadProps {
  tenantId: string;
  name: string;
  email?: string;
  phone: string;
  whatsappId?: string;
  status: LeadStatus;
  classification: LeadClassification;
  qualificationScore: number; // 0-100
  sentiment: SentimentType;
  assignedToId?: string; // Agent ID
  queueId?: string;
  source: string; // WHATSAPP, WEBSITE, etc
  tags: string[];
  customFields: Record<string, any>;
  aiSummary?: string;
  aiNotes?: string;
  intent?: string;
  firstMessageAt: Date;
  lastMessageAt: Date;
  assignedAt?: Date;
  closedAt?: Date;
  createdAt: Date;
}

export class Lead extends AggregateRoot<LeadProps> {
  private conversations: Message[] = [];

  private constructor(props: LeadProps, id?: UniqueEntityID) {
    super(props, id);
  }

  static create(
    props: Omit<LeadProps, 'createdAt' | 'firstMessageAt' | 'lastMessageAt'>,
    id?: UniqueEntityID
  ): Lead {
    const now = new Date();
    const lead = new Lead(
      {
        ...props,
        createdAt: now,
        firstMessageAt: now,
        lastMessageAt: now,
      },
      id
    );
    return lead;
  }

  // Getters
  get tenantId(): string {
    return this.props.tenantId;
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string | undefined {
    return this.props.email;
  }

  get phone(): string {
    return this.props.phone;
  }

  get whatsappId(): string | undefined {
    return this.props.whatsappId;
  }

  get status(): LeadStatus {
    return this.props.status;
  }

  get classification(): LeadClassification {
    return this.props.classification;
  }

  get qualificationScore(): number {
    return this.props.qualificationScore;
  }

  get sentiment(): SentimentType {
    return this.props.sentiment;
  }

  get assignedToId(): string | undefined {
    return this.props.assignedToId;
  }

  get queueId(): string | undefined {
    return this.props.queueId;
  }

  get intent(): string | undefined {
    return this.props.intent;
  }

  get aiSummary(): string | undefined {
    return this.props.aiSummary;
  }

  // Domain Logic - Qualificação
  qualify(score: number, classification: LeadClassification, sentiment: SentimentType): void {
    if (score < 0 || score > 100) {
      throw new Error('Score deve estar entre 0 e 100');
    }

    this.props.qualificationScore = score;
    this.props.classification = classification;
    this.props.sentiment = sentiment;
    this.props.lastMessageAt = new Date();

    // Disparar evento de qualificação
    // this.addDomainEvent(new LeadQualified(this));
  }

  // Domain Logic - Atribuição
  assignToAgent(agentId: string): void {
    if (this.props.status === LeadStatus.CLOSED) {
      throw new Error('Não é possível atribuir um lead fechado');
    }

    this.props.assignedToId = agentId;
    this.props.status = LeadStatus.WITH_AGENT;
    this.props.assignedAt = new Date();
  }

  // Domain Logic - Entrada em Fila
  enqueueInQueue(queueId: string): void {
    if (this.props.status === LeadStatus.CLOSED) {
      throw new Error('Não é possível enfileirar um lead fechado');
    }

    this.props.queueId = queueId;
    this.props.status = LeadStatus.IN_QUEUE;
  }

  // Domain Logic - Fechamento
  close(): void {
    if (this.props.status === LeadStatus.CLOSED) {
      throw new Error('Lead já está fechado');
    }

    this.props.status = LeadStatus.CLOSED;
    this.props.closedAt = new Date();
  }

  // Domain Logic - Atualizar Intent
  updateIntent(intent: string, summary: string, notes?: string): void {
    this.props.intent = intent;
    this.props.aiSummary = summary;
    if (notes) {
      this.props.aiNotes = notes;
    }
  }

  // Domain Logic - Adicionar Tag
  addTag(tag: string): void {
    if (!this.props.tags.includes(tag)) {
      this.props.tags.push(tag);
    }
  }

  // Domain Logic - Remover Tag
  removeTag(tag: string): void {
    this.props.tags = this.props.tags.filter((t) => t !== tag);
  }

  // Domain Logic - Atualizar Campo Customizado
  updateCustomField(key: string, value: any): void {
    this.props.customFields[key] = value;
  }

  // Domain Logic - Registrar Mensagem
  recordMessage(message: Message): void {
    this.conversations.push(message);
    this.props.lastMessageAt = new Date();
  }

  getConversations(): Message[] {
    return this.conversations;
  }

  validate(): boolean {
    return (
      this.props.name &&
      this.props.name.length > 0 &&
      this.props.phone &&
      this.props.phone.length > 0 &&
      this.props.tenantId &&
      this.props.tenantId.length > 0
    );
  }
}
