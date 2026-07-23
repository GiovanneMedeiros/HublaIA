export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: string;
};

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'AGENT' | 'SECRETARY';
  tenantId: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type Lead = {
  id: string;
  tenantId: string;
  name: string;
  email?: string;
  phone: string;
  whatsappId?: string;
  status: 'NEW' | 'IN_QUEUE' | 'ASSIGNED' | 'CLOSED';
  classification: 'BLUE' | 'YELLOW' | 'GREEN' | 'GRAY' | 'RED';
  qualificationScore: number;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  assignedToId?: string;
  queueId?: string;
  source: string;
  tags: string[];
  customFields: Record<string, any>;
  aiSummary?: string;
  intent?: string;
  createdAt: string;
  updatedAt: string;
};

export type Agent = {
  id: string;
  tenantId: string;
  userId: string;
  name: string;
  title?: string;
  bio?: string;
  status: 'ONLINE' | 'OFFLINE' | 'BUSY' | 'AWAY';
  isAvailable: boolean;
  currentConversations: number;
  maxConcurrent: number;
  specialties: string[];
  departmentId?: string;
  totalLeads: number;
  totalClosed: number;
  averageRating?: number;
  responseTime?: number;
  createdAt: string;
};

export type Conversation = {
  id: string;
  tenantId: string;
  leadId: string;
  agentId?: string;
  messages: Message[];
  status: 'ACTIVE' | 'CLOSED';
  lastMessageAt: string;
  createdAt: string;
};

export type Message = {
  id: string;
  conversationId: string;
  sender: 'CLIENT' | 'AI' | 'AGENT';
  content: string;
  timestamp: string;
};

export type OnboardingStep =
  | 'company'
  | 'business'
  | 'segmentModules'
  | 'agent'
  | 'routing'
  | 'integrations'
  | 'review';

export type BusinessType =
  | 'REAL_ESTATE'
  | 'CLINIC'
  | 'AUTOMOTIVE'
  | 'RETAIL'
  | 'SERVICES'
  | 'EDUCATION'
  | 'OTHER';

export type DashboardMenuItem = {
  key: string;
  label: string;
  href: string;
  module?: string;
};

export type PropertyProvider = {
  key: string;
  name: string;
  description: string;
  actionLabel: string;
  available: boolean;
  statusText: string;
};

export type OnboardingState = {
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
    businessType: BusinessType;
    activeModules: string[];
  };
  dynamicSteps: OnboardingStep[];
  menu: DashboardMenuItem[];
  propertyProviders: PropertyProvider[];
  recommendations: {
    suggestedPersonality: string;
    suggestedDistributionMode: string;
    suggestedWelcomeMessage: string;
  };
};
