/**
 * Auth Application DTOs
 */

import { IsString, IsEmail, IsOptional } from 'class-validator';

export class LoginDTO {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  tenantId?: string;
}

export class RegisterDTO {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  tenantId: string;
}

export class RefreshTokenDTO {
  @IsString()
  refreshToken: string;
}

export class AuthResponseDTO {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    tenantId: string;
  };
}
