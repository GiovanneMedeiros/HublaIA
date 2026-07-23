export const BUSINESS_TYPES = [
  'REAL_ESTATE',
  'CLINIC',
  'AUTOMOTIVE',
  'RETAIL',
  'SERVICES',
  'EDUCATION',
  'OTHER',
] as const;

export type BusinessType = (typeof BUSINESS_TYPES)[number];

export const CORE_MODULES = [
  'CORE_WHATSAPP',
  'CORE_AGENT',
  'CORE_CONVERSATIONS',
  'CORE_LEADS',
  'CORE_TEAM',
  'CORE_DISTRIBUTION',
  'CORE_NOTIFICATIONS',
] as const;

export const SEGMENT_MODULES: Record<BusinessType, string[]> = {
  REAL_ESTATE: [
    'REAL_ESTATE_PROPERTIES',
    'REAL_ESTATE_AGENTS',
    'REAL_ESTATE_REGIONS',
    'REAL_ESTATE_INTEGRATIONS',
    'REAL_ESTATE_ROUTING',
  ],
  CLINIC: ['CLINIC_PROFESSIONALS', 'CLINIC_SERVICES', 'CLINIC_SCHEDULE'],
  AUTOMOTIVE: ['AUTOMOTIVE_VEHICLES', 'AUTOMOTIVE_INVENTORY', 'AUTOMOTIVE_TEST_DRIVE'],
  RETAIL: ['RETAIL_PRODUCTS', 'RETAIL_INVENTORY', 'RETAIL_CATALOG'],
  SERVICES: ['SERVICES_APPOINTMENTS', 'SERVICES_CATALOG'],
  EDUCATION: ['EDUCATION_STUDENTS', 'EDUCATION_COURSES', 'EDUCATION_SCHEDULE'],
  OTHER: [],
};

export type DashboardMenuItem = {
  key: string;
  label: string;
  href: string;
  module?: string;
};

export const SEGMENT_DASHBOARD_MENU: Record<BusinessType, DashboardMenuItem[]> = {
  REAL_ESTATE: [
    { key: 'dashboard', label: 'Dashboard', href: '/dashboard' },
    { key: 'conversations', label: 'Conversas', href: '/conversations' },
    { key: 'leads', label: 'Leads', href: '/leads' },
    { key: 'properties', label: 'Imóveis', href: '/properties', module: 'REAL_ESTATE_PROPERTIES' },
    { key: 'brokers', label: 'Corretores', href: '/brokers', module: 'REAL_ESTATE_AGENTS' },
    { key: 'queue', label: 'Fila de atendimento', href: '/queue', module: 'REAL_ESTATE_ROUTING' },
    {
      key: 'integrations',
      label: 'Integrações',
      href: '/integrations',
      module: 'REAL_ESTATE_INTEGRATIONS',
    },
    { key: 'agent', label: 'Agente', href: '/agent' },
    { key: 'settings', label: 'Configurações', href: '/settings' },
  ],
  CLINIC: [
    { key: 'dashboard', label: 'Dashboard', href: '/dashboard' },
    { key: 'conversations', label: 'Conversas', href: '/conversations' },
    { key: 'leads', label: 'Leads', href: '/leads' },
    {
      key: 'professionals',
      label: 'Profissionais',
      href: '/professionals',
      module: 'CLINIC_PROFESSIONALS',
    },
    { key: 'services', label: 'Serviços', href: '/services', module: 'CLINIC_SERVICES' },
    { key: 'schedule', label: 'Agenda', href: '/schedule', module: 'CLINIC_SCHEDULE' },
    { key: 'integrations', label: 'Integrações', href: '/integrations' },
    { key: 'agent', label: 'Agente', href: '/agent' },
    { key: 'settings', label: 'Configurações', href: '/settings' },
  ],
  AUTOMOTIVE: [
    { key: 'dashboard', label: 'Dashboard', href: '/dashboard' },
    { key: 'conversations', label: 'Conversas', href: '/conversations' },
    { key: 'leads', label: 'Leads', href: '/leads' },
    { key: 'vehicles', label: 'Veículos', href: '/vehicles', module: 'AUTOMOTIVE_VEHICLES' },
    { key: 'inventory', label: 'Estoque', href: '/inventory', module: 'AUTOMOTIVE_INVENTORY' },
    {
      key: 'test-drive',
      label: 'Test drive',
      href: '/test-drive',
      module: 'AUTOMOTIVE_TEST_DRIVE',
    },
    { key: 'integrations', label: 'Integrações', href: '/integrations' },
    { key: 'agent', label: 'Agente', href: '/agent' },
    { key: 'settings', label: 'Configurações', href: '/settings' },
  ],
  RETAIL: [
    { key: 'dashboard', label: 'Dashboard', href: '/dashboard' },
    { key: 'conversations', label: 'Conversas', href: '/conversations' },
    { key: 'leads', label: 'Leads', href: '/leads' },
    { key: 'products', label: 'Produtos', href: '/products', module: 'RETAIL_PRODUCTS' },
    { key: 'inventory', label: 'Estoque', href: '/inventory', module: 'RETAIL_INVENTORY' },
    { key: 'catalog', label: 'Catálogo', href: '/catalog', module: 'RETAIL_CATALOG' },
    { key: 'integrations', label: 'Integrações', href: '/integrations' },
    { key: 'agent', label: 'Agente', href: '/agent' },
    { key: 'settings', label: 'Configurações', href: '/settings' },
  ],
  SERVICES: [
    { key: 'dashboard', label: 'Dashboard', href: '/dashboard' },
    { key: 'conversations', label: 'Conversas', href: '/conversations' },
    { key: 'leads', label: 'Leads', href: '/leads' },
    { key: 'integrations', label: 'Integrações', href: '/integrations' },
    { key: 'agent', label: 'Agente', href: '/agent' },
    { key: 'settings', label: 'Configurações', href: '/settings' },
  ],
  EDUCATION: [
    { key: 'dashboard', label: 'Dashboard', href: '/dashboard' },
    { key: 'conversations', label: 'Conversas', href: '/conversations' },
    { key: 'leads', label: 'Leads', href: '/leads' },
    { key: 'integrations', label: 'Integrações', href: '/integrations' },
    { key: 'agent', label: 'Agente', href: '/agent' },
    { key: 'settings', label: 'Configurações', href: '/settings' },
  ],
  OTHER: [
    { key: 'dashboard', label: 'Dashboard', href: '/dashboard' },
    { key: 'conversations', label: 'Conversas', href: '/conversations' },
    { key: 'leads', label: 'Leads', href: '/leads' },
    { key: 'team', label: 'Equipe', href: '/team' },
    { key: 'queue', label: 'Fila de atendimento', href: '/queue' },
    { key: 'integrations', label: 'Integrações', href: '/integrations' },
    { key: 'agent', label: 'Agente', href: '/agent' },
    { key: 'settings', label: 'Configurações', href: '/settings' },
  ],
};

export function normalizeBusinessType(value?: string): BusinessType {
  const candidate = String(value || 'OTHER')
    .trim()
    .toUpperCase();
  return BUSINESS_TYPES.includes(candidate as BusinessType) ? (candidate as BusinessType) : 'OTHER';
}

export function buildModulesByBusinessType(businessType: BusinessType): string[] {
  return [...new Set([...CORE_MODULES, ...(SEGMENT_MODULES[businessType] || [])])];
}

export function mapLegacySegmentToBusinessType(segment?: string): BusinessType {
  const normalized = String(segment || '')
    .trim()
    .toUpperCase();
  if (normalized === 'IMOBILIARIA') {
    return 'REAL_ESTATE';
  }
  if (normalized === 'CLINICA') {
    return 'CLINIC';
  }
  if (normalized === 'CONCESSIONARIA') {
    return 'AUTOMOTIVE';
  }
  if (normalized === 'LOJA') {
    return 'RETAIL';
  }
  if (normalized === 'SERVICOS') {
    return 'SERVICES';
  }
  if (normalized === 'EDUCACAO') {
    return 'EDUCATION';
  }
  return normalizeBusinessType(normalized || 'OTHER');
}
