import { Entity } from './Entity';
import { DomainEvent } from './events/DomainEvent';

interface AggregateRootProps {
  [prop: string]: any;
}

/**
 * AggregateRoot é uma Entity que coordena um grupo de objetos de domínio
 * Responsável por manter consistência e disparar Domain Events
 */
export abstract class AggregateRoot<T extends AggregateRootProps> extends Entity<T> {
  private domainEvents: DomainEvent[] = [];

  protected addDomainEvent(domainEvent: DomainEvent): void {
    this.domainEvents.push(domainEvent);
  }

  public getDomainEvents(): DomainEvent[] {
    return this.domainEvents;
  }

  public clearDomainEvents(): void {
    this.domainEvents = [];
  }

  public abstract validate(): boolean;
}
