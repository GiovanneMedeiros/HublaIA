import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/PrismaService';
import {
  buildModulesByBusinessType,
  BusinessType,
  DashboardMenuItem,
  mapLegacySegmentToBusinessType,
  normalizeBusinessType,
  SEGMENT_DASHBOARD_MENU,
} from '@shared/domain/moduleCatalog';

@Injectable()
export class TenantModuleService {
  constructor(private readonly prisma: PrismaService) {}

  async getTenantContext(tenantId: string): Promise<{
    businessType: BusinessType;
    activeModules: string[];
    menu: DashboardMenuItem[];
  }> {
    const company = await this.prisma.company.findUniqueOrThrow({
      where: { id: tenantId },
      select: {
        settings: true,
      },
    });

    const settings = this.asObject(company.settings);
    const businessType = normalizeBusinessType(settings.businessType as string);
    const activeModules = this.normalizeModuleList(settings.activeModules);

    return {
      businessType,
      activeModules,
      menu: this.filterMenuByModules(businessType, activeModules),
    };
  }

  async setBusinessType(tenantId: string, businessTypeInput: string): Promise<void> {
    const businessType = normalizeBusinessType(businessTypeInput);
    const company = await this.prisma.company.findUniqueOrThrow({
      where: { id: tenantId },
      select: { settings: true },
    });

    const settings = this.asObject(company.settings);

    await this.prisma.company.update({
      where: { id: tenantId },
      data: {
        settings: {
          ...settings,
          businessType,
        },
      },
    });
  }

  async syncModulesByBusinessType(tenantId: string, businessTypeInput: string): Promise<string[]> {
    const businessType = normalizeBusinessType(businessTypeInput);
    const modules = buildModulesByBusinessType(businessType);

    const company = await this.prisma.company.findUniqueOrThrow({
      where: { id: tenantId },
      select: { settings: true },
    });

    const settings = this.asObject(company.settings);

    await this.prisma.company.update({
      where: { id: tenantId },
      data: {
        settings: {
          ...settings,
          businessType,
          activeModules: modules,
        },
      },
    });

    return modules;
  }

  async ensureFromLegacySegment(
    tenantId: string,
    segment?: string
  ): Promise<{
    businessType: BusinessType;
    activeModules: string[];
  }> {
    const businessType = mapLegacySegmentToBusinessType(segment);
    const activeModules = await this.syncModulesByBusinessType(tenantId, businessType);

    return {
      businessType,
      activeModules,
    };
  }

  async isModuleEnabled(tenantId: string, moduleKey: string): Promise<boolean> {
    const context = await this.getTenantContext(tenantId);
    return context.activeModules.includes(moduleKey);
  }

  async updateModuleConfig(
    tenantId: string,
    moduleKey: string,
    config: Record<string, any>
  ): Promise<void> {
    const company = await this.prisma.company.findUniqueOrThrow({
      where: { id: tenantId },
      select: { settings: true },
    });

    const settings = this.asObject(company.settings);
    const moduleConfigs = this.asObject(settings.moduleConfigs);

    await this.prisma.company.update({
      where: { id: tenantId },
      data: {
        settings: {
          ...settings,
          moduleConfigs: {
            ...moduleConfigs,
            [moduleKey]: {
              ...(this.asObject(moduleConfigs[moduleKey]) as Record<string, any>),
              ...config,
            },
          },
        },
      },
    });
  }

  async getModuleConfig(tenantId: string, moduleKey: string): Promise<Record<string, any>> {
    const company = await this.prisma.company.findUniqueOrThrow({
      where: { id: tenantId },
      select: { settings: true },
    });

    const settings = this.asObject(company.settings);
    const moduleConfigs = this.asObject(settings.moduleConfigs);

    return this.asObject(moduleConfigs[moduleKey]);
  }

  private asObject(value: unknown): Record<string, any> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return {};
    }

    return value as Record<string, any>;
  }

  private normalizeModuleList(value: unknown): string[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value.map((item) => String(item).trim()).filter((item) => item.length > 0);
  }

  private filterMenuByModules(
    businessType: BusinessType,
    activeModules: string[]
  ): DashboardMenuItem[] {
    const menu = SEGMENT_DASHBOARD_MENU[businessType] || SEGMENT_DASHBOARD_MENU.OTHER;

    return menu.filter((item) => {
      if (!item.module) {
        return true;
      }
      return activeModules.includes(item.module);
    });
  }
}
