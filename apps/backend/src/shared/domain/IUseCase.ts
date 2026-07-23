import { Result } from './Result';

/**
 * Interface para todos os Use Cases
 * Define contrato que todos os use cases devem seguir
 */
export interface IUseCase<IRequest, IResponse> {
  execute(request: IRequest): Promise<IResponse> | IResponse;
}

/**
 * Use case response wrapper padronizado
 */
export interface UseCaseResponse<T = any> {
  isRight: boolean;
  value?: T;
  error?: string;
}

/**
 * Função auxiliar para criar respostas de use case
 */
export const createUseCaseResponse = <T>(result: Result<T>): UseCaseResponse<T> => {
  if (result.isSuccess) {
    return {
      isRight: true,
      value: result.getValue(),
    };
  }
  return {
    isRight: false,
    error: result.error,
  };
};
