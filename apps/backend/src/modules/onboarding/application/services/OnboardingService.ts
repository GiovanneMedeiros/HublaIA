import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/database/PrismaService';
import { QueueStrategy } from '@shared/domain/enums';
import { normalizeBusinessType, BusinessType } from '@shared/domain/moduleCatalog';
import { TenantModuleService } from '@shared/infrastructure/services/TenantModuleService';
import {
  CompleteOnboardingDTO,
  OnboardingStateDTO,
  OnboardingStep,
  SaveOnboardingStepDTO,
} from '../dtos/OnboardingDTOs';

const BASE_STEPS: OnboardingStep[] = [
  'company',
  'business',
  'agent',
  'routing',
  'integrations',
  'review',
];

const VALID_PERSONALITIES = ['PROFISSIONAL', 'CONSULTIVO', 'ASSERTIVO', 'AMIGAVEL'];
const VALID_DISTRIBUTION_MODES = ['AUTOMATIC', 'ROUND_ROBIN', 'MANUAL'];

@Injectable()
export class OnboardingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantModuleService: TenantModuleService
  ) {}

  async getState(tenantId: string): Promise<OnboardingStateDTO> {
    await this.ensureOnboardingRecords(tenantId);
    const db = this.prisma as any;

    const [company, onboarding, businessProfile, agentSetting, routingRule] = await Promise.all([
      this.prisma.company.findUniqueOrThrow({ where: { id: tenantId } }),
      db.tenantOnboarding.findUniqueOrThrow({ where: { tenantId } }),
      db.tenantBusinessProfile.findUniqueOrThrow({ where: { tenantId } }),
      db.tenantAgentSetting.findUniqueOrThrow({ where: { tenantId } }),
      db.tenantRoutingRule.findUniqueOrThrow({ where: { tenantId } }),
    ]);

    const tenantContext = await this.ensureTenantModuleContext(
      tenantId,
      businessProfile.customData?.businessType || businessProfile.segment
    );

    const dynamicSteps = this.getDynamicSteps(tenantContext.businessType);

    return {
      progress: {
        currentStep: onboarding.currentStep as OnboardingStep,
        completedSteps: onboarding.completedSteps as OnboardingStep[],
        isCompleted: onboarding.isCompleted,
        completedAt: onboarding.completedAt ? onboarding.completedAt.toISOString() : null,
      },
      steps: {
        company: {
          name: company.name,
          email: company.email,
          phone: company.phone,
          city: company.city,
          website: company.website,
          description: company.description,
        },
        business: {
          businessType: tenantContext.businessType,
          segment: businessProfile.segment,
          city: businessProfile.city,
          businessDescription: businessProfile.businessDescription,
          communicationStyle: businessProfile.communicationStyle,
          importantInfo: businessProfile.importantInfo,
          propertyTypes: businessProfile.propertyTypes,
          serviceAreas: businessProfile.serviceAreas,
          specialties: businessProfile.specialties,
          priceRange: businessProfile.priceRange,
          workingHours: businessProfile.workingHours,
          extraDescription: businessProfile.extraDescription,
          customData: businessProfile.customData,
        },
        segmentModules: await this.getSegmentModuleSetup(tenantId, tenantContext.businessType),
        agent: {
          agentName: agentSetting.agentName,
          personality: agentSetting.personality,
          language: agentSetting.language,
          welcomeMessage: agentSetting.welcomeMessage,
          transferTriggers: agentSetting.transferTriggers,
          allowHumanRequest: agentSetting.allowHumanRequest,
          classificationSettings: agentSetting.classificationSettings,
        },
        routing: {
          distributionMode: routingRule.distributionMode,
          prioritizeAvailable: routingRule.prioritizeAvailable,
          teamAvailability: routingRule.teamAvailability,
          queueOrder: routingRule.queueOrder,
        },
        integrations: {
          whatsappConnected: false,
          calendarConnected: false,
          smtpConnected: false,
        },
        review: {},
      },
      tenant: {
        businessType: tenantContext.businessType,
        activeModules: tenantContext.activeModules,
      },
      dynamicSteps,
      menu: tenantContext.menu,
      propertyProviders: await this.getPropertyProviders(tenantId),
      recommendations: this.buildRecommendations(
        tenantContext.businessType,
        agentSetting.personality
      ),
    };
  }

  async saveStep(tenantId: string, dto: SaveOnboardingStepDTO): Promise<OnboardingStateDTO> {
    await this.ensureOnboardingRecords(tenantId);

    const step = dto.step;
    const currentState = await this.getState(tenantId);
    const dynamicSteps = currentState.dynamicSteps;

    if (!dynamicSteps.includes(step)) {
      throw new BadRequestException('Etapa de onboarding inválida para o segmento selecionado');
    }

    const payload = this.validateAndNormalizePayload(step, dto.payload || {});

    await this.prisma.$transaction(async (tx: any) => {
      if (step === 'company') {
        await tx.company.update({
          where: { id: tenantId },
          data: {
            name: payload.name,
            email: payload.email,
            phone: payload.phone,
            city: payload.city,
            website: payload.website,
            description: payload.description,
          },
        });
      }

      if (step === 'business') {
        await tx.tenantBusinessProfile.update({
          where: { tenantId },
          data: {
            segment: payload.segment,
            city: payload.city,
            businessDescription: payload.businessDescription,
            communicationStyle: payload.communicationStyle,
            importantInfo: payload.importantInfo,
            propertyTypes: payload.propertyTypes,
            serviceAreas: payload.serviceAreas,
            specialties: payload.specialties,
            priceRange: payload.priceRange,
            workingHours: payload.workingHours,
            extraDescription: payload.extraDescription,
            customData: payload.customData,
          },
        });
      }

      if (step === 'agent') {
        await tx.tenantAgentSetting.update({
          where: { tenantId },
          data: {
            agentName: payload.agentName,
            personality: payload.personality,
            language: payload.language,
            welcomeMessage: payload.welcomeMessage,
            transferTriggers: payload.transferTriggers,
            allowHumanRequest: payload.allowHumanRequest,
            classificationSettings: payload.classificationSettings,
          },
        });
      }

      if (step === 'routing') {
        await tx.tenantRoutingRule.update({
          where: { tenantId },
          data: {
            distributionMode: payload.distributionMode,
            prioritizeAvailable: payload.prioritizeAvailable,
            teamAvailability: payload.teamAvailability,
            queueOrder: payload.queueOrder,
          },
        });
      }

      if (step === 'integrations') {
        const company = await tx.company.findUniqueOrThrow({
          where: { id: tenantId },
          select: { metadata: true },
        });

        await tx.company.update({
          where: { id: tenantId },
          data: {
            metadata: {
              ...(company.metadata as Record<string, any>),
              onboardingIntegrations: {
                whatsappConnected: payload.whatsappConnected,
                calendarConnected: payload.calendarConnected,
                smtpConnected: payload.smtpConnected,
              },
            },
          },
        });
      }

      const onboarding = await tx.tenantOnboarding.findUniqueOrThrow({ where: { tenantId } });
      const completed = new Set(onboarding.completedSteps as OnboardingStep[]);
      completed.add(step);

      const businessType =
        step === 'business'
          ? payload.businessType
          : normalizeBusinessType(currentState.tenant.businessType);
      const nextStep = this.getNextStep(step, businessType);

      await tx.tenantOnboarding.update({
        where: { tenantId },
        data: {
          completedSteps: Array.from(completed),
          currentStep: nextStep,
        },
      });
    });

    if (step === 'business') {
      await this.tenantModuleService.setBusinessType(tenantId, payload.businessType);
      await this.tenantModuleService.syncModulesByBusinessType(tenantId, payload.businessType);
    }

    if (step === 'segmentModules') {
      await this.tenantModuleService.updateModuleConfig(tenantId, 'REAL_ESTATE_SETUP', payload);
    }

    return this.getState(tenantId);
  }

  async complete(tenantId: string, dto: CompleteOnboardingDTO): Promise<OnboardingStateDTO> {
    await this.ensureOnboardingRecords(tenantId);
    const db = this.prisma as any;

    const state = await this.getState(tenantId);

    const [businessProfile, agentSetting, routingRule] = await Promise.all([
      db.tenantBusinessProfile.findUniqueOrThrow({ where: { tenantId } }),
      db.tenantAgentSetting.findUniqueOrThrow({ where: { tenantId } }),
      db.tenantRoutingRule.findUniqueOrThrow({ where: { tenantId } }),
    ]);

    const shouldCreatePrompt = dto.createDefaultPrompt ?? true;
    if (shouldCreatePrompt) {
      await this.ensureDefaultPrompt(
        tenantId,
        state.tenant.businessType as BusinessType,
        businessProfile,
        agentSetting
      );
    }

    const shouldProvisionDefaults = dto.provisionDefaults ?? true;
    if (shouldProvisionDefaults) {
      await this.provisionDefaults(
        tenantId,
        routingRule,
        state.tenant.businessType as BusinessType
      );
    }

    const finalSteps = this.getDynamicSteps(state.tenant.businessType as BusinessType);

    await db.tenantOnboarding.update({
      where: { tenantId },
      data: {
        isCompleted: true,
        completedAt: new Date(),
        currentStep: dto.finalStep || 'review',
        completedSteps: finalSteps,
      },
    });

    return this.getState(tenantId);
  }

  async getPropertyProviders(tenantId: string): Promise<OnboardingStateDTO['propertyProviders']> {
    const context = await this.getState(tenantId);

    if (context.tenant.businessType !== 'REAL_ESTATE') {
      return [];
    }

    const realEstateConfig = await this.tenantModuleService.getModuleConfig(
      tenantId,
      'REAL_ESTATE_SETUP'
    );
    const requestedIntegrations = Array.isArray(realEstateConfig.requestedIntegrations)
      ? realEstateConfig.requestedIntegrations.map((item) => String(item))
      : [];

    return [
      {
        key: 'sobressai',
        name: 'Sobressai',
        description: 'Conecte sua base de imóveis do Sobressai.',
        actionLabel: requestedIntegrations.includes('sobressai')
          ? 'Solicitação enviada'
          : 'Solicitar integração',
        available: false,
        statusText: 'Disponível em breve',
      },
      {
        key: 'api',
        name: 'API',
        description: 'Conecte através de uma API.',
        actionLabel: 'Configurar API',
        available: false,
        statusText: 'Disponível em breve',
      },
      {
        key: 'xml',
        name: 'XML',
        description: 'Importe seus imóveis através de um feed XML.',
        actionLabel: 'Conectar XML',
        available: false,
        statusText: 'Disponível em breve',
      },
      {
        key: 'csv',
        name: 'CSV',
        description: 'Importe seus imóveis através de um arquivo CSV.',
        actionLabel: 'Importar CSV',
        available: false,
        statusText: 'Disponível em breve',
      },
      {
        key: 'spreadsheet',
        name: 'Planilha',
        description: 'Importe imóveis através de uma planilha.',
        actionLabel: 'Importar planilha',
        available: false,
        statusText: 'Disponível em breve',
      },
      {
        key: 'other',
        name: 'Outra integração',
        description: 'Possui outra plataforma?',
        actionLabel: 'Solicitar integração',
        available: false,
        statusText: 'Solicitar integração',
      },
    ];
  }

  async requestPropertyIntegration(tenantId: string, providerKey: string): Promise<void> {
    const state = await this.getState(tenantId);
    if (state.tenant.businessType !== 'REAL_ESTATE') {
      throw new BadRequestException('Este tenant não possui módulo imobiliário habilitado');
    }

    const config = await this.tenantModuleService.getModuleConfig(tenantId, 'REAL_ESTATE_SETUP');
    const current = Array.isArray(config.requestedIntegrations)
      ? config.requestedIntegrations.map((item) => String(item))
      : [];

    if (!current.includes(providerKey)) {
      current.push(providerKey);
    }

    await this.tenantModuleService.updateModuleConfig(tenantId, 'REAL_ESTATE_SETUP', {
      requestedIntegrations: current,
      updatedAt: new Date().toISOString(),
    });
  }

  private validateAndNormalizePayload(step: OnboardingStep, payload: Record<string, any>) {
    if (step === 'company') {
      if (!payload.name || String(payload.name).trim().length < 2) {
        throw new BadRequestException('Nome da empresa é obrigatório');
      }

      if (!payload.email || !String(payload.email).includes('@')) {
        throw new BadRequestException('Email da empresa é obrigatório e deve ser válido');
      }

      return {
        name: String(payload.name).trim(),
        email: String(payload.email).trim().toLowerCase(),
        phone: payload.phone ? String(payload.phone).trim() : undefined,
        city: payload.city ? String(payload.city).trim() : undefined,
        website: payload.website ? String(payload.website).trim() : undefined,
        description: payload.description ? String(payload.description).trim() : undefined,
      };
    }

    if (step === 'business') {
      const businessType = normalizeBusinessType(payload.businessType || payload.segment);

      return {
        businessType,
        segment: businessType,
        city: payload.city ? String(payload.city).trim() : undefined,
        businessDescription: payload.businessDescription
          ? String(payload.businessDescription).trim()
          : undefined,
        communicationStyle: payload.communicationStyle
          ? String(payload.communicationStyle).trim().toUpperCase()
          : undefined,
        importantInfo: payload.importantInfo ? String(payload.importantInfo).trim() : undefined,
        propertyTypes: this.normalizeArray(payload.propertyTypes),
        serviceAreas: this.normalizeArray(payload.serviceAreas),
        specialties: this.normalizeArray(payload.specialties),
        priceRange: payload.priceRange ? String(payload.priceRange).trim() : undefined,
        workingHours: payload.workingHours ? String(payload.workingHours).trim() : undefined,
        extraDescription: payload.extraDescription
          ? String(payload.extraDescription).trim()
          : undefined,
        customData: {
          ...this.normalizeObject(payload.customData),
          businessType,
        },
      };
    }

    if (step === 'segmentModules') {
      return {
        propertyProvider: payload.propertyProvider ? String(payload.propertyProvider) : undefined,
        brokersConfigured: Boolean(payload.brokersConfigured),
        routingConfigured: Boolean(payload.routingConfigured),
        regions: this.normalizeArray(payload.regions),
        priceRanges: this.normalizeArray(payload.priceRanges),
        configureLater: Boolean(payload.configureLater),
      };
    }

    if (step === 'agent') {
      if (!payload.agentName || String(payload.agentName).trim().length < 2) {
        throw new BadRequestException('Nome do agente é obrigatório');
      }

      const personality = String(payload.personality || '')
        .trim()
        .toUpperCase();
      if (personality && !VALID_PERSONALITIES.includes(personality)) {
        throw new BadRequestException('Personalidade inválida para o agente');
      }

      return {
        agentName: String(payload.agentName).trim(),
        personality: personality || 'PROFISSIONAL',
        language: payload.language ? String(payload.language).trim() : 'pt-BR',
        welcomeMessage: payload.welcomeMessage ? String(payload.welcomeMessage).trim() : undefined,
        transferTriggers: this.normalizeArray(payload.transferTriggers),
        allowHumanRequest:
          typeof payload.allowHumanRequest === 'boolean' ? payload.allowHumanRequest : true,
        classificationSettings: this.normalizeObject(payload.classificationSettings),
      };
    }

    if (step === 'routing') {
      const distributionMode = String(payload.distributionMode || '')
        .trim()
        .toUpperCase();
      if (!VALID_DISTRIBUTION_MODES.includes(distributionMode)) {
        throw new BadRequestException('Modo de distribuição inválido');
      }

      return {
        distributionMode,
        prioritizeAvailable:
          typeof payload.prioritizeAvailable === 'boolean' ? payload.prioritizeAvailable : true,
        teamAvailability: Array.isArray(payload.teamAvailability) ? payload.teamAvailability : [],
        queueOrder: Array.isArray(payload.queueOrder) ? payload.queueOrder : [],
      };
    }

    if (step === 'integrations') {
      return {
        whatsappConnected: Boolean(payload.whatsappConnected),
        calendarConnected: Boolean(payload.calendarConnected),
        smtpConnected: Boolean(payload.smtpConnected),
      };
    }

    return payload;
  }

  private normalizeArray(value: any): string[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value.map((item) => String(item).trim()).filter((item) => item.length > 0);
  }

  private normalizeObject(value: any): Record<string, any> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return {};
    }

    return value;
  }

  private async ensureDefaultPrompt(
    tenantId: string,
    businessType: BusinessType,
    businessProfile: any,
    agentSetting: any
  ): Promise<void> {
    const db = this.prisma as any;
    const existingPrompt = await db.aIPrompt.findFirst({
      where: {
        tenantId,
        isActive: true,
      },
      select: { id: true },
    });

    if (existingPrompt) {
      return;
    }

    const promptName = `Prompt Inicial ${businessType}`;

    const systemPrompt = [
      `Você é ${agentSetting.agentName || 'o assistente da empresa'}.`,
      `Personalidade principal: ${agentSetting.personality || 'PROFISSIONAL'}.`,
      `Idioma: ${agentSetting.language || 'pt-BR'}.`,
      `Segmento da empresa: ${businessType}.`,
      `Cidade principal: ${businessProfile.city || 'não informada'}.`,
      `Descrição do negócio: ${businessProfile.businessDescription || 'não informada'}.`,
      `Mensagem de boas-vindas padrão: ${agentSetting.welcomeMessage || 'Olá! Como posso ajudar?'}.`,
      'Objetivo: qualificar leads com clareza, registrar intenção e encaminhar para humano quando necessário.',
    ].join('\n');

    await db.aIPrompt.create({
      data: {
        tenantId,
        name: promptName,
        description: 'Prompt inicial gerado automaticamente pelo onboarding',
        systemPrompt,
        temperature: 0.5,
        maxTokens: 900,
        tags: ['onboarding', businessType.toLowerCase()],
        isActive: true,
      },
    });
  }

  private async provisionDefaults(
    tenantId: string,
    routingRule: any,
    businessType: BusinessType
  ): Promise<void> {
    const db = this.prisma as any;

    const queueName = businessType === 'REAL_ESTATE' ? 'Fila de Corretores' : 'Atendimento Inicial';
    const queueDescription =
      businessType === 'REAL_ESTATE'
        ? 'Fila padrão de corretores criada pelo onboarding'
        : 'Fila padrão criada pelo onboarding';

    const queue = await db.queue.findFirst({
      where: {
        tenantId,
        name: queueName,
      },
      select: { id: true },
    });

    const strategy = this.mapDistributionModeToQueueStrategy(routingRule.distributionMode);

    const defaultQueue =
      queue ||
      (await db.queue.create({
        data: {
          tenantId,
          name: queueName,
          description: queueDescription,
          strategy,
          isActive: true,
          settings: {
            createdBy: 'onboarding',
          },
        },
        select: { id: true },
      }));

    const adminUser = await db.user.findFirst({
      where: {
        tenantId,
        status: 'ACTIVE',
      },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!adminUser) {
      return;
    }

    const existingAgent = await db.agent.findUnique({
      where: {
        userId: adminUser.id,
      },
      select: { id: true },
    });

    const agent =
      existingAgent ||
      (await db.agent.create({
        data: {
          tenantId,
          userId: adminUser.id,
          name: `${adminUser.firstName} ${adminUser.lastName}`.trim(),
          title: businessType === 'REAL_ESTATE' ? 'Corretor Principal' : 'Atendente Principal',
          status: 'ONLINE',
          isAvailable: true,
          maxConcurrent: 5,
          specialties: ['ONBOARDING_DEFAULT'],
          settings: {
            createdBy: 'onboarding',
          },
        },
        select: { id: true },
      }));

    const assignment = await db.queueAssignment.findFirst({
      where: {
        queueId: defaultQueue.id,
        agentId: agent.id,
      },
      select: { id: true },
    });

    if (!assignment) {
      await db.queueAssignment.create({
        data: {
          queueId: defaultQueue.id,
          agentId: agent.id,
          order: 1,
          isActive: true,
        },
      });
    }
  }

  private mapDistributionModeToQueueStrategy(mode: string): QueueStrategy {
    if (mode === 'ROUND_ROBIN') {
      return QueueStrategy.ROUND_ROBIN;
    }

    if (mode === 'MANUAL') {
      return QueueStrategy.FIXED_ORDER;
    }

    return QueueStrategy.AVAILABILITY;
  }

  private async ensureOnboardingRecords(tenantId: string): Promise<void> {
    const db = this.prisma as any;

    await db.tenantOnboarding.upsert({
      where: { tenantId },
      update: {},
      create: {
        tenantId,
        currentStep: 'company',
        completedSteps: [],
      },
    });

    await db.tenantBusinessProfile.upsert({
      where: { tenantId },
      update: {},
      create: {
        tenantId,
      },
    });

    await db.tenantAgentSetting.upsert({
      where: { tenantId },
      update: {},
      create: {
        tenantId,
      },
    });

    await db.tenantRoutingRule.upsert({
      where: { tenantId },
      update: {},
      create: {
        tenantId,
      },
    });
  }

  private getNextStep(step: OnboardingStep, businessType: BusinessType): OnboardingStep {
    const steps = this.getDynamicSteps(businessType);
    const index = steps.indexOf(step);

    if (index === -1 || index === steps.length - 1) {
      return 'review';
    }

    return steps[index + 1];
  }

  private getDynamicSteps(businessType: BusinessType): OnboardingStep[] {
    if (businessType === 'REAL_ESTATE') {
      return [
        'company',
        'business',
        'segmentModules',
        'agent',
        'routing',
        'integrations',
        'review',
      ];
    }

    return BASE_STEPS;
  }

  private buildRecommendations(businessType: BusinessType, personality: string) {
    const personalityBySegment: Record<BusinessType, string> = {
      REAL_ESTATE: 'CONSULTIVO',
      CLINIC: 'AMIGAVEL',
      AUTOMOTIVE: 'ASSERTIVO',
      RETAIL: 'PROFISSIONAL',
      SERVICES: 'PROFISSIONAL',
      EDUCATION: 'CONSULTIVO',
      OTHER: personality || 'PROFISSIONAL',
    };

    const suggestedPersonality = personalityBySegment[businessType] || personalityBySegment.OTHER;

    const suggestedDistributionMode = businessType === 'REAL_ESTATE' ? 'ROUND_ROBIN' : 'AUTOMATIC';

    return {
      suggestedPersonality,
      suggestedDistributionMode,
      suggestedWelcomeMessage:
        businessType === 'REAL_ESTATE'
          ? 'Oi! Sou seu assistente digital. Posso te ajudar a encontrar o imóvel ideal hoje?'
          : 'Oi! Sou o assistente virtual da equipe. Como posso te ajudar agora?',
    };
  }

  private async ensureTenantModuleContext(tenantId: string, rawBusinessType?: string) {
    let context = await this.tenantModuleService.getTenantContext(tenantId);

    if (!context.activeModules.length) {
      const businessType = normalizeBusinessType(rawBusinessType);
      await this.tenantModuleService.syncModulesByBusinessType(tenantId, businessType);
      context = await this.tenantModuleService.getTenantContext(tenantId);
    }

    return context;
  }

  private async getSegmentModuleSetup(tenantId: string, businessType: BusinessType) {
    if (businessType !== 'REAL_ESTATE') {
      return {};
    }

    const config = await this.tenantModuleService.getModuleConfig(tenantId, 'REAL_ESTATE_SETUP');

    return {
      propertyProvider: config.propertyProvider || null,
      brokersConfigured: Boolean(config.brokersConfigured),
      routingConfigured: Boolean(config.routingConfigured),
      regions: Array.isArray(config.regions) ? config.regions : [],
      priceRanges: Array.isArray(config.priceRanges) ? config.priceRanges : [],
      configureLater: Boolean(config.configureLater),
    };
  }
}
