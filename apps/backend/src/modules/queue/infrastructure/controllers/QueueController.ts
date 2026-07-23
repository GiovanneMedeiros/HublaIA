/**
 * Queue Controller
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
} from '@nestjs/common';
import { JwtAuthGuard } from '@shared/infrastructure/guards/JwtAuthGuard';
import { TenantGuard } from '@shared/infrastructure/guards/TenantGuard';
import { CreateQueueUseCase } from '../../application/usecases/CreateQueueUseCase';
import { AddAgentToQueueUseCase } from '../../application/usecases/AddAgentToQueueUseCase';
import { UpdateQueueUseCase } from '../../application/usecases/UpdateQueueUseCase';
import { GetNextAgentUseCase } from '../../application/usecases/GetNextAgentUseCase';
import { ListQueuesUseCase } from '../../application/usecases/ListQueuesUseCase';
import {
  CreateQueueDTO,
  AddAgentToQueueDTO,
  UpdateQueueDTO,
  GetNextAgentDTO,
  QueueResponseDTO,
  QueueAssignmentResponseDTO,
} from '../../application/dtos/QueueDTOs';
import { IApiResponse } from '@shared/types';
import { IPaginatedResult } from '@shared/types';

interface GetNextAgentResponse {
  agentId: string;
  queueId: string;
}

@Controller('queues')
@UseGuards(JwtAuthGuard, TenantGuard)
export class QueueController {
  constructor(
    private readonly createQueueUseCase: CreateQueueUseCase,
    private readonly addAgentToQueueUseCase: AddAgentToQueueUseCase,
    private readonly updateQueueUseCase: UpdateQueueUseCase,
    private readonly getNextAgentUseCase: GetNextAgentUseCase,
    private readonly listQueuesUseCase: ListQueuesUseCase
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateQueueDTO,
    @Param('tenantId') tenantId: string
  ): Promise<IApiResponse<QueueResponseDTO>> {
    const result = await this.createQueueUseCase.execute({
      ...dto,
      tenantId,
    });

    if (result.isFailure) {
      return {
        success: false,
        error: {
          code: 'CREATE_QUEUE_ERROR',
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
    @Query() query: any,
    @Param('tenantId') tenantId: string
  ): Promise<IApiResponse<IPaginatedResult<QueueResponseDTO>>> {
    const result = await this.listQueuesUseCase.execute({
      tenantId,
      page: query.page || 1,
      limit: query.limit || 10,
    });

    if (result.isFailure) {
      return {
        success: false,
        error: {
          code: 'LIST_QUEUES_ERROR',
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
    @Body() dto: UpdateQueueDTO,
    @Param('tenantId') tenantId: string
  ): Promise<IApiResponse<QueueResponseDTO>> {
    const result = await this.updateQueueUseCase.execute({
      ...dto,
      queueId: id,
      tenantId,
    });

    if (result.isFailure) {
      return {
        success: false,
        error: {
          code: 'UPDATE_QUEUE_ERROR',
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

  @Post(':id/agents')
  @HttpCode(HttpStatus.CREATED)
  async addAgent(
    @Param('id') id: string,
    @Body() dto: AddAgentToQueueDTO,
    @Param('tenantId') tenantId: string
  ): Promise<IApiResponse<QueueAssignmentResponseDTO>> {
    const result = await this.addAgentToQueueUseCase.execute({
      ...dto,
      queueId: id,
      tenantId,
    });

    if (result.isFailure) {
      return {
        success: false,
        error: {
          code: 'ADD_AGENT_TO_QUEUE_ERROR',
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

  @Post(':id/next-agent')
  @HttpCode(HttpStatus.OK)
  async getNextAgent(
    @Param('id') id: string,
    @Body() dto: GetNextAgentDTO,
    @Param('tenantId') tenantId: string
  ): Promise<IApiResponse<GetNextAgentResponse>> {
    const result = await this.getNextAgentUseCase.execute({
      ...dto,
      queueId: id,
      tenantId,
    });

    if (result.isFailure) {
      return {
        success: false,
        error: {
          code: 'GET_NEXT_AGENT_ERROR',
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
