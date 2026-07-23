/**
 * Result Pattern para tratamento de erros funcional
 * Permite que funções retornem sucesso ou falha sem exceções
 */
export class Result<T> {
  public readonly isSuccess: boolean;
  public readonly isFailure: boolean;
  public readonly error?: string;

  private constructor(isSuccess: boolean, value?: T, error?: string) {
    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    if (this.isSuccess) {
      Object.defineProperty(this, 'value', {
        value: value,
        enumerable: true,
      });
    }
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, value);
  }

  public static fail<U>(error: string): Result<U> {
    return new Result<U>(false, undefined, error);
  }

  public static combine(results: Result<any>[]): Result<any> {
    for (const result of results) {
      if (result.isFailure) return result;
    }
    return Result.ok();
  }

  public getValue(): T {
    if (!this.isSuccess) {
      throw new Error(
        `Can't get the value of an error result.\nUse 'getError' instead.\n\nMessage: ${this.error}`
      );
    }

    return (this as any).value;
  }
}
