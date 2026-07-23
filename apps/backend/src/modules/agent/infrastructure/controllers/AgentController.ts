/**
 * Agent Controller
 */

import {
  Controller,
  Get,
  Post,
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
import { CreateAgentUseCase } from '../../application/usecases/CreateAgentUseCase';
import { UpdateAgentUseCase } from '../../application/usecases/UpdateAgentUseCase';
import { GetAgentDetailsUseCase } from '../../application/usecases/GetAgentDetailsUseCase';
import { UpdateAgentAvailabilityUseCase } from '../../application/usecases/UpdateAgentAvailabilityUseCase';
import { ListAgentsUseCase } from '../../application/usecases/ListAgentsUseCase';
import {
  CreateAgentDTO,
  UpdateAgentDTO,
  UpdateAgentAvailabilityDTO,
  AgentResponseDTO,
  ListAgentsQueryDTO,
} from '../../application/dtos/AgentDTOs';
import { IApiResponse } from '@shared/types';
import { IPaginatedResult } from '@shared/types';

@Controller('agents')
@UseGuards(JwtAuthGuard, TenantGuard)
export class AgentController {
  constructor(
    private readonly createAgentUseCase: CreateAgentUseCase,
    private readonly updateAgentUseCase: UpdateAgentUseCase,
    private readonly getAgentDetailsUseCase: GetAgentDetailsUseCase,
    private readonly updateAgentAvailabilityUseCase: UpdateAgentAvailabilityUseCase,
    private readonly listAgentsUseCase: ListAgentsUseCase
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateAgentDTO,
    @Req() req: Request
  ): Promise<IApiResponse<AgentResponseDTO>> {
    const tenantId = (req as any).tenant?.id;
    const result = await this.createAgentUseCase.execute({
      ...dto,
      tenantId,
    });

    if (result.isFailure) {
      return {
        success: false,
        error: {
          code: 'CREATE_AGENT_ERROR',
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
  ): Promise<IApiResponse<AgentResponseDTO>> {
    const tenantId = (req as any).tenant?.id;
    const result = await this.getAgentDetailsUseCase.execute({
      agentId: id,
      tenantId,
    });

    if (result.isFailure) {
      return {
        success: false,
        error: {
          code: 'AGENT_NOT_FOUND',
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
    @Query() query: ListAgentsQueryDTO,
    @Req() req: Request
  ): Promise<IApiResponse<IPaginatedResult<AgentResponseDTO>>> {
    const tenantId = (req as any).tenant?.id;
    const result = await this.listAgentsUseCase.execute({
      ...query,
      tenantId,
    });

    if (result.isFailure) {
      return {
        success: false,
        error: {
          code: 'LIST_AGENTS_ERROR',
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

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAgentDTO,
    @Req() req: Request
  ): Promise<IApiResponse<AgentResponseDTO>> {
    const tenantId = (req as any).tenant?.id;
    const result = await this.updateAgentUseCase.execute({
      ...dto,
      agentId: id,
      tenantId,
    });

    if (result.isFailure) {
      return {
        success: false,
        error: {
          code: 'UPDATE_AGENT_ERROR',
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

  @Put(':id/availability')
  @HttpCode(HttpStatus.OK)
  async updateAvailability(
    @Param('id') id: string,
    @Body() dto: UpdateAgentAvailabilityDTO,
    @Req() req: Request
  ): Promise<IApiResponse<AgentResponseDTO>> {
    const tenantId = (req as any).tenant?.id;
    const result = await this.updateAgentAvailabilityUseCase.execute({
      ...dto,
      agentId: id,
      tenantId,
    });

    if (result.isFailure) {
      return {
        success: false,
        error: {
          code: 'UPDATE_AGENT_AVAILABILITY_ERROR',
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
