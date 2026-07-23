/**
 * Tipos e interfaces compartilhadas
 */

export interface ICurrentTenant {
  id: string;
  userId: string;
  userRole: string;
}

export interface ICurrentUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId: string;
}

export interface IJWTPayload {
  sub: string; // user id
  email: string;
  tenantId: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface IPaginationOptions {
  page: number;
  limit: number;
  offset?: number;
}

export interface IPaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  path?: string;
}

export interface ILogger {
  log(message: string, context?: string, metadata?: any): void;
  error(message: string, trace?: string, context?: string, metadata?: any): void;
  warn(message: string, context?: string, metadata?: any): void;
  debug(message: string, context?: string, metadata?: any): void;
}

export interface IEncryptionService {
  encrypt(plainText: string): string;
  decrypt(cipherText: string): string;
}

export interface ITokenService {
  generateAccessToken(payload: any, expiresIn?: string): string;
  generateRefreshToken(payload: any, expiresIn?: string): string;
  verifyAccessToken(token: string): any;
  verifyRefreshToken(token: string): any;
  decodeToken(token: string): any;
}

export interface IHashService {
  hash(plainText: string): Promise<string>;
  compare(plainText: string, hash: string): Promise<boolean>;
}
