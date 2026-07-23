import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { IEncryptionService } from '@shared/types';

/**
 * Serviço de criptografia para dados sensíveis
 * Usa AES-256-GCM para melhor segurança
 */
@Injectable()
export class EncryptionService implements IEncryptionService {
  private algorithm = 'aes-256-gcm';
  private key: Buffer;

  constructor() {
    // Em produção, usar variável de ambiente
    const keyString = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';
    this.key = crypto.scryptSync(keyString, 'salt', 32);
  }

  encrypt(plainText: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);

    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = (cipher as crypto.CipherGCM).getAuthTag();

    // Formato: iv:authTag:encrypted
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  decrypt(cipherText: string): string {
    const parts = cipherText.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];

    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    (decipher as crypto.DecipherGCM).setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
