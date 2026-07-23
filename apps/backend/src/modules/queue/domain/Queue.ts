/**
 * Queue Domain - Entidades
 */

import { AggregateRoot } from '@shared/domain/AggregateRoot';
import { UniqueEntityID } from '@shared/domain/UniqueEntityID';
import { QueueStrategy } from '@shared/domain/enums';

interface QueueProps {
  tenantId: string;
  name: string;
  description?: string;
  strategy: QueueStrategy;
  departmentId?: string;
  isActive: boolean;
  maxRetries: number;
  assignmentTimeout: number; // segundos
  settings: Record<string, any>;
  createdAt: Date;
}

export class Queue extends AggregateRoot<QueueProps> {
  private constructor(props: QueueProps, id?: UniqueEntityID) {
    super(props, id);
  }

  static create(props: Omit<QueueProps, 'createdAt'>, id?: UniqueEntityID): Queue {
    return new Queue(
      {
        ...props,
        createdAt: new Date(),
      },
      id
    );
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get name(): string {
    return this.props.name;
  }

  get strategy(): QueueStrategy {
    return this.props.strategy;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  activate(): void {
    this.props.isActive = true;
  }

  deactivate(): void {
    this.props.isActive = false;
  }

  updateStrategy(strategy: QueueStrategy): void {
    this.props.strategy = strategy;
  }

  validate(): boolean {
    return this.props.name && this.props.name.length > 0;
  }
}

/**
 * QueueAssignment - Associação de Agente à Fila
 */

interface QueueAssignmentProps {
  queueId: string;
  agentId: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
}

export class QueueAssignment extends AggregateRoot<QueueAssignmentProps> {
  private constructor(props: QueueAssignmentProps, id?: UniqueEntityID) {
    super(props, id);
  }

  static create(
    props: Omit<QueueAssignmentProps, 'createdAt'>,
    id?: UniqueEntityID
  ): QueueAssignment {
    return new QueueAssignment(
      {
        ...props,
        createdAt: new Date(),
      },
      id
    );
  }

  get queueId(): string {
    return this.props.queueId;
  }

  get agentId(): string {
    return this.props.agentId;
  }

  get order(): number {
    return this.props.order;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  updateOrder(order: number): void {
    this.props.order = order;
  }

  deactivate(): void {
    this.props.isActive = false;
  }

  activate(): void {
    this.props.isActive = true;
  }

  validate(): boolean {
    return this.props.queueId && this.props.agentId && this.props.order >= 0;
  }
}
