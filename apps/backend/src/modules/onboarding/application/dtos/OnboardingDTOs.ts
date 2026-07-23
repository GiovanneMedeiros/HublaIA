import { IsBoolean, IsEnum, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export type OnboardingStep =
  'company' | 'business' | 'segmentModules' | 'agent' | 'routing' | 'integrations' | 'review';

export enum OnboardingStepEnum {
  COMPANY = 'company',
  BUSINESS = 'business',
  SEGMENT_MODULES = 'segmentModules',
  AGENT = 'agent',
  ROUTING = 'routing',
  INTEGRATIONS = 'integrations',
  REVIEW = 'review',
}

export class SaveOnboardingStepDTO {
  @IsEnum(OnboardingStepEnum)
  step: OnboardingStep;

  @IsObject()
  @IsNotEmpty()
  payload: Record<string, any>;
}

export class CompleteOnboardingDTO {
  @IsOptional()
  @IsEnum(OnboardingStepEnum)
  finalStep?: OnboardingStep;

  @IsOptional()
  @IsBoolean()
  provisionDefaults?: boolean;

  @IsOptional()
  @IsBoolean()
  createDefaultPrompt?: boolean;
}

export class OnboardingStateDTO {
  progress: {
    currentStep: OnboardingStep;
    completedSteps: OnboardingStep[];
    isCompleted: boolean;
    completedAt: string | null;
  };
  steps: {
    company: Record<string, any>;
    business: Record<string, any>;
    segmentModules: Record<string, any>;
    agent: Record<string, any>;
    routing: Record<string, any>;
    integrations: Record<string, any>;
    review: Record<string, any>;
  };
  tenant: {
    businessType: string;
    activeModules: string[];
  };
  dynamicSteps: OnboardingStep[];
  menu: Array<{
    key: string;
    label: string;
    href: string;
    module?: string;
  }>;
  propertyProviders: Array<{
    key: string;
    name: string;
    description: string;
    actionLabel: string;
    available: boolean;
    statusText: string;
  }>;
  recommendations: {
    suggestedPersonality: string;
    suggestedDistributionMode: string;
    suggestedWelcomeMessage: string;
  };
}
