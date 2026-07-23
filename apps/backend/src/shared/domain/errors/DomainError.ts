/**
 * Exceções de domínio - erros esperados e previsíveis
 */
export class DomainError extends Error {
  public readonly code: string;

  constructor(message: string, code: string = 'DOMAIN_ERROR') {
    super(message);
    this.code = code;
    this.name = this.constructor.name;
  }
}

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super('Email ou senha inválidos', 'INVALID_CREDENTIALS');
  }
}

export class InvalidTenantError extends DomainError {
  constructor() {
    super('Tenant inválido ou não encontrado', 'INVALID_TENANT');
  }
}

export class InvalidLeadStatusError extends DomainError {
  constructor(status: string) {
    super(`Status de lead inválido: ${status}`, 'INVALID_LEAD_STATUS');
  }
}

export class UnauthorizedAccessError extends DomainError {
  constructor() {
    super('Acesso não autorizado', 'UNAUTHORIZED');
  }
}

export class ResourceNotFoundError extends DomainError {
  constructor(resource: string, id: string) {
    super(`${resource} com ID ${id} não encontrado`, 'RESOURCE_NOT_FOUND');
  }
}

export class DuplicateResourceError extends DomainError {
  constructor(resource: string, field: string) {
    super(`${resource} com ${field} já existe`, 'DUPLICATE_RESOURCE');
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
  }
}
