import { UniqueEntityID } from './UniqueEntityID';

interface EntityProps {
  [prop: string]: any;
}

/**
 * Entity é um objeto de domínio que possui identidade única
 * Dois Entities são iguais se seus IDs forem iguais
 */
export abstract class Entity<T extends EntityProps> {
  public props: T;
  protected readonly _id: UniqueEntityID;

  constructor(props: T, id?: UniqueEntityID) {
    this.props = props;
    this._id = id ? id : new UniqueEntityID();
  }

  public get id(): UniqueEntityID {
    return this._id;
  }

  public equals(entity?: Entity<T>): boolean {
    if (entity === null || entity === undefined) {
      return false;
    }
    if (this === entity) {
      return true;
    }
    return this._id.equals(entity._id);
  }

  public getProps(): T {
    return this.props;
  }

  public abstract validate(): boolean;
}
