import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IHashService } from '@shared/types';

/**
 * Serviço de hash de senhas usando bcrypt
 */
@Injectable()
export class HashService implements IHashService {
  private readonly SALT_ROUNDS = 10;

  async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, this.SALT_ROUNDS);
  }

  async compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}
