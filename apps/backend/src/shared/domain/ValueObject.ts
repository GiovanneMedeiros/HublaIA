import { UniqueEntityID } from './UniqueEntityID';

/**
 * ValueObject é um objeto de domínio que não possui identidade
 * Dois ValueObjects são iguais se seus valores forem iguais
 */
export abstract class ValueObject<T> {
  protected readonly props: T;

  constructor(props: T) {
    this.props = Object.freeze(props);
  }

  public abstract equals(vo: ValueObject<T>): boolean;

  public toString(): string {
    return JSON.stringify(this.props);
  }

  public getValue(): T {
    return this.props;
  }
}
