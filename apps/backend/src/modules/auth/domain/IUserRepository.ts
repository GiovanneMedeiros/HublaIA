/**
 * Auth Domain - Repository Interface
 */

import { User } from './User';
import { Result } from '@shared/domain/Result';

export interface IUserRepository {
  findByEmail(email: string, tenantId: string): Promise<Result<User>>;
  findByEmailOnly(email: string): Promise<Result<User>>;
  findById(id: string, tenantId: string): Promise<Result<User>>;
  create(user: User): Promise<Result<User>>;
  update(user: User): Promise<Result<void>>;
  delete(id: string, tenantId: string): Promise<Result<void>>;
}
