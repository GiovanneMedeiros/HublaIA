import { UniqueEntityID } from '../UniqueEntityID';

/**
 * Domain Event é um evento que representa algo importante que ocorreu no domínio
 * Usado para comunicação entre agregados e contextos limitados
 */
export abstract class DomainEvent {
  public dateTimeOccurred: Date;
  public id: string;

  constructor() {
    this.dateTimeOccurred = new Date();
    this.id = new UniqueEntityID().getValue;
  }

  /**
   * Retorna o ID do agregado que gerou este evento
   */
  abstract getAggregateId(): UniqueEntityID;

  /**
   * Retorna o nome do evento
   */
  abstract getEventName(): string;
}
