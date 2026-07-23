import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '@shared/infrastructure/guards/JwtAuthGuard';
import { TenantGuard } from '@shared/infrastructure/guards/TenantGuard';
import { IApiResponse } from '@shared/types';
import {
  CompleteOnboardingDTO,
  OnboardingStateDTO,
  SaveOnboardingStepDTO,
} from '../../application/dtos/OnboardingDTOs';
import { OnboardingService } from '../../application/services/OnboardingService';
import { ModuleAccessGuard } from '@shared/infrastructure/guards/ModuleAccessGuard';
import { RequireModule } from '@shared/infrastructure/decorators/RequireModule';
import { TenantModuleService } from '@shared/infrastructure/services/TenantModuleService';

@Controller('onboarding')
@UseGuards(JwtAuthGuard, TenantGuard)
export class OnboardingController {
  constructor(
    private readonly onboardingService: OnboardingService,
    private readonly tenantModuleService: TenantModuleService
  ) {}

  @Get('state')
  async getState(@Req() req: Request): Promise<IApiResponse<OnboardingStateDTO>> {
    const tenantId = (req as any).tenant?.id;
    const state = await this.onboardingService.getState(tenantId);

    return {
      success: true,
      data: state,
      timestamp: new Date().toISOString(),
    };
  }

  @Put('step')
  @HttpCode(HttpStatus.OK)
  async saveStep(
    @Req() req: Request,
    @Body() dto: SaveOnboardingStepDTO
  ): Promise<IApiResponse<OnboardingStateDTO>> {
    const tenantId = (req as any).tenant?.id;
    const state = await this.onboardingService.saveStep(tenantId, dto);

    return {
      success: true,
      data: state,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('complete')
  @HttpCode(HttpStatus.OK)
  async complete(
    @Req() req: Request,
    @Body() dto: CompleteOnboardingDTO = {}
  ): Promise<IApiResponse<OnboardingStateDTO>> {
    const tenantId = (req as any).tenant?.id;
    const state = await this.onboardingService.complete(tenantId, dto);

    return {
      success: true,
      data: state,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('modules/check/:moduleKey')
  async checkModule(
    @Req() req: Request,
    @Param('moduleKey') moduleKey: string
  ): Promise<IApiResponse<{ enabled: boolean }>> {
    const tenantId = (req as any).tenant?.id;
    const enabled = await this.tenantModuleService.isModuleEnabled(tenantId, moduleKey);

    return {
      success: true,
      data: { enabled },
      timestamp: new Date().toISOString(),
    };
  }

  @Get('real-estate/property-providers')
  @UseGuards(JwtAuthGuard, TenantGuard, ModuleAccessGuard)
  @RequireModule('REAL_ESTATE_PROPERTIES')
  async getPropertyProviders(@Req() req: Request): Promise<IApiResponse<any[]>> {
    const tenantId = (req as any).tenant?.id;
    const providers = await this.onboardingService.getPropertyProviders(tenantId);

    return {
      success: true,
      data: providers,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('real-estate/property-providers/:providerKey/request')
  @UseGuards(JwtAuthGuard, TenantGuard, ModuleAccessGuard)
  @RequireModule('REAL_ESTATE_PROPERTIES')
  @HttpCode(HttpStatus.OK)
  async requestPropertyProvider(
    @Req() req: Request,
    @Param('providerKey') providerKey: string
  ): Promise<IApiResponse<{ requested: boolean }>> {
    const tenantId = (req as any).tenant?.id;

    if (!providerKey || providerKey.length < 2) {
      throw new ForbiddenException('Provider inválido para solicitação');
    }

    await this.onboardingService.requestPropertyIntegration(tenantId, providerKey);

    return {
      success: true,
      data: { requested: true },
      timestamp: new Date().toISOString(),
    };
  }
}
