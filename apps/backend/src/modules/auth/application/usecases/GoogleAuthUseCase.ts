/**
 * Auth Use Case - Google Sign In
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/database/PrismaService';
import { HashService } from '@shared/infrastructure/services/HashService';
import { TokenService } from '@shared/infrastructure/services/TokenService';
import { AuthResponseDTO } from '../dtos/AuthDTOs';
import { randomUUID } from 'crypto';

interface GoogleProfileData {
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  emailVerified?: boolean;
}

@Injectable()
export class GoogleAuthUseCase {
  constructor(
    private prisma: PrismaService,
    private hashService: HashService,
    private tokenService: TokenService
  ) {}

  async execute(profile: GoogleProfileData): Promise<AuthResponseDTO> {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        email: profile.email,
        deletedAt: null,
      },
    });

    let user = existingUser;

    if (!user) {
      const company = await this.prisma.company.create({
        data: {
          name: `${profile.firstName || 'Conta'} ${profile.lastName || 'Google'}`.trim(),
          slug: await this.generateUniqueSlug(profile.email),
          email: profile.email,
          billingEmail: profile.email,
          country: 'BR',
          city: 'São Paulo',
          settings: {},
          metadata: {},
        },
      });

      const passwordHash = await this.hashService.hash(randomUUID());

      user = await this.prisma.user.create({
        data: {
          tenantId: company.id,
          email: profile.email,
          password: passwordHash,
          firstName: profile.firstName,
          lastName: profile.lastName,
          avatar: profile.avatar,
          role: 'ADMIN',
          status: 'ACTIVE',
          emailVerified: profile.emailVerified ? new Date() : null,
          lastLogin: new Date(),
        },
      });
    } else {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          firstName: user.firstName || profile.firstName,
          lastName: user.lastName || profile.lastName,
          avatar: profile.avatar || user.avatar,
          emailVerified: user.emailVerified || (profile.emailVerified ? new Date() : null),
          lastLogin: new Date(),
        },
      });
    }

    const payload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      role: user.role,
    };

    return {
      accessToken: this.tokenService.generateAccessToken(payload),
      refreshToken: this.tokenService.generateRefreshToken(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tenantId: user.tenantId,
      },
    };
  }

  private async generateUniqueSlug(email: string): Promise<string> {
    const baseSlug =
      email
        .split('@')[0]
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'hublaia-google';

    let slug = baseSlug;
    let suffix = 1;

    while (await this.prisma.company.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    return slug;
  }
}
