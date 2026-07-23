/**
 * Lead Infrastructure - Controller
 */

import {
  Controller,
  Post,
  Get,
  Put,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '@shared/infrastructure/guards/JwtAuthGuard';
import { TenantGuard } from '@shared/infrastructure/guards/TenantGuard';
import { CreateLeadUseCase } from '../../application/usecases/CreateLeadUseCase';
import { QualifyLeadUseCase } from '../../application/usecases/QualifyLeadUseCase';
import { AutoQualifyLeadUseCase } from '../../application/usecases/AutoQualifyLeadUseCase';
import { AssignLeadToAgentUseCase } from '../../application/usecases/AssignLeadToAgentUseCase';
import { GetLeadDetailsUseCase } from '../../application/usecases/GetLeadDetailsUseCase';
import { ListLeadsUseCase } from '../../application/usecases/ListLeadsUseCase';
import {
  CreateLeadDTO,
  QualifyLeadDTO,
  AssignLeadToAgentDTO,
  LeadResponseDTO,
  ListLeadsQueryDTO,
} from '../../application/dtos/LeadDTOs';
import { IApiResponse } from '@shared/types';
import { IPaginatedResult } from '@shared/types';

@Controller('leads')
@UseGuards(JwtAuthGuard, TenantGuard)
export class LeadController {
  constructor(
    private readonly createLeadUseCase: CreateLeadUseCase,
    private readonly qualifyLeadUseCase: QualifyLeadUseCase,
    private readonly autoQualifyLeadUseCase: AutoQualifyLeadUseCase,
    private readonly assignLeadToAgentUseCase: AssignLeadToAgentUseCase,
    private readonly getLeadDetailsUseCase: GetLeadDetailsUseCase,
    private readonly listLeadsUseCase: ListLeadsUseCase
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateLeadDTO,
    @Req() req: Request
  ): Promise<IApiResponse<LeadResponseDTO>> {
    const tenantId = (req as any).tenant?.id;
    const result = await this.createLeadUseCase.execute({
      ...dto,
      tenantId,
    });

    if (result.isFailure) {
      return {
        success: false,
        error: {
          code: 'CREATE_LEAD_ERROR',
          message: result.error,
        },
        timestamp: new Date().toISOString(),
      };
    }

    return {
      success: true,
      data: result.getValue(),
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  async getById(
    @Param('id') id: string,
    @Req() req: Request
  ): Promise<IApiResponse<LeadResponseDTO>> {
    const tenantId = (req as any).tenant?.id;
    const result = await this.getLeadDetailsUseCase.execute({
      leadId: id,
      tenantId,
    });

    if (result.isFailure) {
      return {
        success: false,
        error: {
          code: 'LEAD_NOT_FOUND',
          message: result.error,
        },
        timestamp: new Date().toISOString(),
      };
    }

    return {
      success: true,
      data: result.getValue(),
      timestamp: new Date().toISOString(),
    };
  }

  @Get()
  async list(
    @Query() query: ListLeadsQueryDTO,
    @Req() req: Request
  ): Promise<IApiResponse<IPaginatedResult<LeadResponseDTO>>> {
    const tenantId = (req as any).tenant?.id;
    const result = await this.listLeadsUseCase.execute({
      ...query,
      tenantId,
    });

    if (result.isFailure) {
      return {
        success: false,
        error: {
          code: 'LIST_LEADS_ERROR',
          message: result.error,
        },
        timestamp: new Date().toISOString(),
      };
    }

    return {
      success: true,
      data: result.getValue(),
      timestamp: new Date().toISOString(),
    };
  }

  @Put(':id/qualify')
  @HttpCode(HttpStatus.OK)
  async qualify(
    @Param('id') id: string,
    @Body() dto: QualifyLeadDTO,
    @Param('tenantId') tenantId: string
  ): Promise<IApiResponse<LeadResponseDTO>> {
    const result = await this.qualifyLeadUseCase.execute({
      ...dto,
      leadId: id,
      tenantId,
    });

    if (result.isFailure) {
      return {
        success: false,
        error: {
          code: 'QUALIFY_LEAD_ERROR',
          message: result.error,
        },
        timestamp: new Date().toISOString(),
      };
    }

    return {
      success: true,
      data: result.getValue(),
      timestamp: new Date().toISOString(),
    };
  }

  @Put(':id/assign')
  @HttpCode(HttpStatus.OK)
  async assignToAgent(
    @Param('id') id: string,
    @Body() dto: AssignLeadToAgentDTO,
    @Param('tenantId') tenantId: string
  ): Promise<IApiResponse<LeadResponseDTO>> {
    const result = await this.assignLeadToAgentUseCase.execute({
      ...dto,
      leadId: id,
      tenantId,
    });

    if (result.isFailure) {
      return {
        success: false,
        error: {
          code: 'ASSIGN_LEAD_ERROR',
          message: result.error,
        },
        timestamp: new Date().toISOString(),
      };
    }

    return {
      success: true,
      data: result.getValue(),
      timestamp: new Date().toISOString(),
    };
  }

  @Post(':id/auto-qualify')
  @HttpCode(HttpStatus.OK)
  async autoQualify(
    @Param('id') id: string,
    @Param('tenantId') tenantId: string
  ): Promise<IApiResponse<LeadResponseDTO>> {
    const result = await this.autoQualifyLeadUseCase.execute({
      leadId: id,
      tenantId,
    });

    if (result.isFailure) {
      return {
        success: false,
        error: {
          code: 'AUTO_QUALIFY_LEAD_ERROR',
          message: result.error,
        },
        timestamp: new Date().toISOString(),
      };
    }

    return {
      success: true,
      data: result.getValue(),
      timestamp: new Date().toISOString(),
    };
  }
}
