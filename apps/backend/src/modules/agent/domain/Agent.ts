/**
 * Agent Domain - Entity e Agregado
 */

import { AggregateRoot } from '@shared/domain/AggregateRoot';
import { UniqueEntityID } from '@shared/domain/UniqueEntityID';
import { AgentStatus } from '@shared/domain/enums';

interface AgentProps {
  tenantId: string;
  userId: string;
  name: string;
  title?: string; // Corretor, Consultor, Médico, etc
  bio?: string;
  status: AgentStatus;
  isAvailable: boolean;
  maxConcurrent: number;
  currentConversations: number;
  specialties: string[];
  departmentId?: string;
  totalLeads: number;
  totalClosed: number;
  averageRating?: number;
  responseTime?: number; // minutos
  settings: Record<string, any>;
  createdAt: Date;
}

export class Agent extends AggregateRoot<AgentProps> {
  private constructor(props: AgentProps, id?: UniqueEntityID) {
    super(props, id);
  }

  static create(props: Omit<AgentProps, 'createdAt'>, id?: UniqueEntityID): Agent {
    return new Agent(
      {
        ...props,
        createdAt: new Date(),
      },
      id
    );
  }

  // Getters
  get tenantId(): string {
    return this.props.tenantId;
  }

  get userId(): string {
    return this.props.userId;
  }

  get name(): string {
    return this.props.name;
  }

  get status(): AgentStatus {
    return this.props.status;
  }

  get isAvailable(): boolean {
    return this.props.isAvailable;
  }

  get currentConversations(): number {
    return this.props.currentConversations;
  }

  get specialties(): string[] {
    return this.props.specialties;
  }

  // Domain Logic
  updateStatus(status: AgentStatus): void {
    this.props.status = status;
    if (status === AgentStatus.OFFLINE) {
      this.props.isAvailable = false;
    }
  }

  setAvailability(isAvailable: boolean): void {
    this.props.isAvailable = isAvailable;
    if (isAvailable) {
      this.props.status = AgentStatus.ONLINE;
    } else {
      this.props.status = AgentStatus.AWAY;
    }
  }

  canReceiveNewConversation(): boolean {
    return this.props.isAvailable && this.props.currentConversations < this.props.maxConcurrent;
  }

  incrementConversations(): void {
    if (this.props.currentConversations < this.props.maxConcurrent) {
      this.props.currentConversations++;
    }
  }

  decrementConversations(): void {
    if (this.props.currentConversations > 0) {
      this.props.currentConversations--;
    }
  }

  addSpecialty(specialty: string): void {
    if (!this.props.specialties.includes(specialty)) {
      this.props.specialties.push(specialty);
    }
  }

  removeSpecialty(specialty: string): void {
    this.props.specialties = this.props.specialties.filter((s) => s !== specialty);
  }

  recordLeadClosed(): void {
    this.props.totalClosed++;
    this.props.totalLeads++;
  }

  recordLeadAdded(): void {
    this.props.totalLeads++;
  }

  updateRating(rating: number): void {
    if (rating < 0 || rating > 5) {
      throw new Error('Rating deve estar entre 0 e 5');
    }
    this.props.averageRating = rating;
  }

  validate(): boolean {
    return (
      this.props.name &&
      this.props.name.length > 0 &&
      this.props.userId &&
      this.props.userId.length > 0
    );
  }
}
