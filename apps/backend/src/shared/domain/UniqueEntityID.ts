import { v4 as uuid, validate as validateUUID } from 'uuid';

/**
 * Identificador único para todas as entidades de domínio
 * Garante que todos os IDs sejam UUIDs válidos
 */
export class UniqueEntityID {
  private readonly value: string;

  constructor(id?: string) {
    this.value = id && validateUUID(id) ? id : uuid();
  }

  get getValue(): string {
    return this.value;
  }

  equals(id?: UniqueEntityID): boolean {
    if (id === null || id === undefined) {
      return false;
    }
    if (!(id instanceof this.constructor)) {
      return false;
    }
    return id.getValue === this.value;
  }

  toString(): string {
    return String(this.value);
  }
}
