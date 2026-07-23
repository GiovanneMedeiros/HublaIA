/**
 * Auth Module
 */

import { Module } from '@nestjs/common';
import { AuthController } from './infrastructure/controllers/AuthController';
import { LoginUseCase } from './application/usecases/LoginUseCase';
import { GoogleAuthUseCase } from './application/usecases/GoogleAuthUseCase';
import { UserRepository } from './infrastructure/repositories/UserRepository';
import { IUserRepository } from './domain/IUserRepository';

@Module({
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    GoogleAuthUseCase,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
  exports: ['IUserRepository'],
})
export class AuthModule {}
