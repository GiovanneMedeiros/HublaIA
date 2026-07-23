/**
 * Auth Use Case - Login
 */

import { Injectable, Inject } from '@nestjs/common';
import { IUseCase } from '@shared/domain/IUseCase';
import { Result } from '@shared/domain/Result';
import { IUserRepository } from '../../domain/IUserRepository';
import { HashService } from '@shared/infrastructure/services/HashService';
import { TokenService } from '@shared/infrastructure/services/TokenService';
import { LoginDTO, AuthResponseDTO } from '../dtos/AuthDTOs';
import { InvalidCredentialsError } from '@shared/domain/errors/DomainError';

@Injectable()
export class LoginUseCase implements IUseCase<LoginDTO, Result<AuthResponseDTO>> {
  constructor(
    @Inject('IUserRepository') private userRepository: IUserRepository,
    private hashService: HashService,
    private tokenService: TokenService
  ) {}

  async execute(request: LoginDTO): Promise<Result<AuthResponseDTO>> {
    // Buscar usuário por email (sem filtro de tenant na primeira busca)
    // Se tenantId for fornecido, usaremos findByEmail, senão usaremos findByEmailOnly
    const userOrError = request.tenantId
      ? await this.userRepository.findByEmail(request.email, request.tenantId)
      : await this.userRepository.findByEmailOnly(request.email);

    if (userOrError.isFailure) {
      return Result.fail<AuthResponseDTO>('Credenciais inválidas');
    }

    const user = userOrError.getValue();

    // Validar senha
    const passwordMatches = await this.hashService.compare(request.password, user.passwordHash);

    if (!passwordMatches) {
      return Result.fail<AuthResponseDTO>('Credenciais inválidas');
    }

    // Atualizar último login
    user.updateLastLogin();
    await this.userRepository.update(user);

    // Gerar tokens
    const payload = {
      sub: user.id.toString(),
      email: user.email,
      tenantId: user.tenantId,
      role: user.role,
    };

    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

    const response: AuthResponseDTO = {
      accessToken,
      refreshToken,
      user: {
        id: user.id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tenantId: user.tenantId,
      },
    };

    return Result.ok<AuthResponseDTO>(response);
  }
}
