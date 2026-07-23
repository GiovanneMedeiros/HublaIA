'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button, Card, Input, Badge } from '@/components/atoms';
import { authService } from '@/services/auth.service';
import { onboardingService } from '@/services/onboarding.service';
import { BusinessType, OnboardingState, OnboardingStep } from '@/types';
import { Building2, CheckCircle2, Sparkles, Home, Users, Route, MapPin, CircleDollarSign } from 'lucide-react';

const FALLBACK_STEPS: OnboardingStep[] = [
  'company',
  'business',
  'agent',
  'routing',
  'integrations',
  'review',
];

const SEGMENT_OPTIONS: Array<{ businessType: BusinessType; label: string; subtitle: string }> = [
  { businessType: 'REAL_ESTATE', label: 'Imobiliária', subtitle: 'Imóveis, corretores e distribuição' },
  { businessType: 'CLINIC', label: 'Clínica', subtitle: 'Profissionais, serviços e agenda' },
  { businessType: 'AUTOMOTIVE', label: 'Concessionária', subtitle: 'Veículos, estoque e test drive' },
  { businessType: 'RETAIL', label: 'Loja', subtitle: 'Produtos, catálogo e estoque' },
  { businessType: 'SERVICES', label: 'Serviços', subtitle: 'Atendimento e operação de serviços' },
  { businessType: 'EDUCATION', label: 'Educação', subtitle: 'Atendimento de alunos e cursos' },
  { businessType: 'OTHER', label: 'Outro', subtitle: 'Fluxo genérico e módulos core' },
];

function getStepMeta(step: OnboardingStep, businessType: BusinessType) {
  if (step === 'company') {
    return { title: 'Empresa', subtitle: 'Dados da operação' };
  }
  if (step === 'business') {
    return { title: 'Segmento', subtitle: 'Selecione o segmento do seu negócio' };
  }
  if (step === 'segmentModules' && businessType === 'REAL_ESTATE') {
    return { title: 'Imobiliário', subtitle: 'Configure sua operação imobiliária' };
  }
  if (step === 'agent') {
    return { title: 'Agente IA', subtitle: 'Tom de voz e regras' };
  }
  if (step === 'routing') {
    return { title: 'Roteamento', subtitle: 'Distribuição de leads' };
  }
  if (step === 'integrations') {
    return { title: 'Integrações', subtitle: 'Conexões iniciais' };
  }

  return { title: 'Revisão', subtitle: 'Finalizar setup' };
}

export default function OnboardingPage() {
  const router = useRouter();
  const [state, setState] = useState<OnboardingState | null>(null);
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('company');
  const [draft, setDraft] = useState<Record<OnboardingStep, Record<string, any>>>({
    company: {},
    business: {},
    segmentModules: {},
    agent: {},
    routing: {},
    integrations: {},
    review: {},
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completionOptions, setCompletionOptions] = useState({
    provisionDefaults: true,
    createDefaultPrompt: true,
  });

  useEffect(() => {
    const init = async () => {
      try {
        await authService.getCurrentUser();
        const response = await onboardingService.getState();

        if (!response.success || !response.data) {
          throw new Error('Erro ao carregar onboarding');
        }

        if (response.data.progress.isCompleted) {
          router.replace('/dashboard');
          return;
        }

        setState(response.data);
        setCurrentStep(response.data.progress.currentStep);
        setDraft(response.data.steps as Record<OnboardingStep, Record<string, any>>);
      } catch {
        router.replace('/auth/login');
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [router]);

  const activeSteps = state?.dynamicSteps?.length ? state.dynamicSteps : FALLBACK_STEPS;

  const progressPercent = useMemo(() => {
    if (!state) return 0;
    const done = state.progress.completedSteps.length;
    return Math.min(100, Math.round((done / activeSteps.length) * 100));
  }, [state, activeSteps]);

  const updateDraft = (step: OnboardingStep, key: string, value: any) => {
    setDraft((prev) => ({
      ...prev,
      [step]: {
        ...prev[step],
        [key]: value,
      },
    }));
  };

  const saveCurrentStep = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await onboardingService.saveStep(currentStep, draft[currentStep]);
      if (!response.success || !response.data) {
        throw new Error('Falha ao salvar etapa');
      }

      setState(response.data);
      setCurrentStep(response.data.progress.currentStep);
      setDraft((prev) => ({
        ...prev,
        ...(response.data?.steps as Record<OnboardingStep, Record<string, any>>),
      }));
    } catch {
      setError('Não foi possível salvar esta etapa agora.');
    } finally {
      setIsSaving(false);
    }
  };

  const goToPrevious = () => {
    const index = activeSteps.indexOf(currentStep);
    if (index <= 0) return;
    setCurrentStep(activeSteps[index - 1]);
  };

  const handleComplete = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await onboardingService.complete(completionOptions);
      if (!response.success) {
        throw new Error('Falha ao finalizar');
      }
      router.replace('/dashboard');
    } catch {
      setError('Não foi possível finalizar o onboarding.');
    } finally {
      setIsSaving(false);
    }
  };

  const businessType = state?.tenant?.businessType || 'OTHER';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <p className="text-neutral-gray">Carregando seu onboarding...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary text-neutral-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="p-6 border border-primary-500/20 bg-gradient-to-b from-bg-secondary to-bg-primary">
          <div className="flex items-center gap-2 text-primary-300">
            <Sparkles className="h-4 w-4" />
            <p className="text-xs uppercase tracking-[0.2em]">Setup inteligente</p>
          </div>

          <h1 className="mt-3 text-2xl font-semibold">Onboarding HublaIA</h1>
          <p className="mt-2 text-sm text-neutral-gray">
            Núcleo compartilhado e módulos dinâmicos por segmento para sua operação.
          </p>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-xs text-neutral-gray">
              <span>Progresso</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-bg-tertiary">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
                animate={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-6 space-y-2">
            {activeSteps.map((step, index) => {
              const active = step === currentStep;
              const completed = state?.progress.completedSteps.includes(step) || state?.progress.isCompleted;
              const meta = getStepMeta(step, businessType);

              return (
                <button
                  key={step}
                  type="button"
                  onClick={() => setCurrentStep(step)}
                  className={`w-full rounded-lg border px-3 py-2 text-left transition-colors ${
                    active
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-bg-tertiary bg-bg-secondary hover:border-primary-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">{index + 1}. {meta.title}</p>
                      <p className="text-xs text-neutral-gray">{meta.subtitle}</p>
                    </div>
                    {completed ? (
                      <CheckCircle2 className="h-4 w-4 text-status-green" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-neutral-gray/50" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="p-6 lg:p-8 border border-bg-tertiary">
          {error && (
            <div className="mb-5 rounded-lg border border-status-red/30 bg-status-red/10 p-3 text-sm text-status-red">
              {error}
            </div>
          )}

          {currentStep === 'company' && (
            <section className="space-y-5">
              <header>
                <h2 className="text-2xl font-semibold">Dados da Empresa</h2>
                <p className="text-sm text-neutral-gray mt-1">Essas informações personalizam sua base operacional.</p>
              </header>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Nome da empresa"
                  value={draft.company.name || ''}
                  onChange={(e) => updateDraft('company', 'name', e.target.value)}
                />
                <Input
                  label="Email"
                  type="email"
                  value={draft.company.email || ''}
                  onChange={(e) => updateDraft('company', 'email', e.target.value)}
                />
                <Input
                  label="Telefone"
                  value={draft.company.phone || ''}
                  onChange={(e) => updateDraft('company', 'phone', e.target.value)}
                />
                <Input
                  label="Cidade"
                  value={draft.company.city || ''}
                  onChange={(e) => updateDraft('company', 'city', e.target.value)}
                />
                <Input
                  label="Website"
                  value={draft.company.website || ''}
                  onChange={(e) => updateDraft('company', 'website', e.target.value)}
                />
              </div>
            </section>
          )}

          {currentStep === 'business' && (
            <section className="space-y-5">
              <header>
                <h2 className="text-2xl font-semibold">Selecione o Segmento</h2>
                <p className="text-sm text-neutral-gray mt-1">
                  O HublaIA habilitará automaticamente os módulos relevantes para sua empresa.
                </p>
              </header>

              <div className="grid gap-3 md:grid-cols-2">
                {SEGMENT_OPTIONS.map((option) => {
                  const isSelected = (draft.business.businessType || businessType) === option.businessType;
                  return (
                    <button
                      key={option.businessType}
                      type="button"
                      onClick={() => updateDraft('business', 'businessType', option.businessType)}
                      className={`rounded-xl border p-4 text-left transition-colors ${
                        isSelected
                          ? 'border-primary-500 bg-primary-500/10'
                          : 'border-bg-tertiary bg-bg-secondary hover:border-primary-500/30'
                      }`}
                    >
                      <p className="text-base font-semibold">{option.label}</p>
                      <p className="text-sm text-neutral-gray mt-1">{option.subtitle}</p>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {currentStep === 'segmentModules' && businessType === 'REAL_ESTATE' && (
            <section className="space-y-5">
              <header>
                <h2 className="text-2xl font-semibold">Configure sua operação imobiliária</h2>
                <p className="text-sm text-neutral-gray mt-1">
                  Defina apenas o essencial agora. Você pode configurar detalhes depois pelo dashboard.
                </p>
              </header>

              <div className="grid gap-3 md:grid-cols-2">
                <Card className="p-4 border border-bg-tertiary">
                  <div className="flex items-center gap-2 text-primary-400"><Home className="h-4 w-4" /> Conectar imóveis</div>
                  <p className="text-sm text-neutral-gray mt-2">
                    Conecte sua base de imóveis para que o agente possa encontrar opções para seus clientes.
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-3"
                    onClick={() => router.push('/onboarding/real-estate/properties')}
                  >
                    Configurar
                  </Button>
                </Card>

                <Card className="p-4 border border-bg-tertiary">
                  <div className="flex items-center gap-2 text-primary-400"><Users className="h-4 w-4" /> Configurar corretores</div>
                  <p className="text-sm text-neutral-gray mt-2">
                    Adicione os profissionais que receberão os atendimentos.
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-3"
                    onClick={() => updateDraft('segmentModules', 'brokersConfigured', true)}
                  >
                    Configurar
                  </Button>
                </Card>

                <Card className="p-4 border border-bg-tertiary">
                  <div className="flex items-center gap-2 text-primary-400"><Route className="h-4 w-4" /> Distribuição de leads</div>
                  <p className="text-sm text-neutral-gray mt-2">
                    Defina como os leads serão distribuídos entre os corretores.
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-3"
                    onClick={() => updateDraft('segmentModules', 'routingConfigured', true)}
                  >
                    Configurar
                  </Button>
                </Card>

                <Card className="p-4 border border-bg-tertiary">
                  <div className="flex items-center gap-2 text-primary-400"><MapPin className="h-4 w-4" /> Regiões atendidas</div>
                  <p className="text-sm text-neutral-gray mt-2">Informe as regiões onde sua imobiliária atua.</p>
                  <Input
                    className="mt-3"
                    placeholder="Ex.: Centro, Zona Sul"
                    value={draft.segmentModules.regions?.join(', ') || ''}
                    onChange={(e) =>
                      updateDraft(
                        'segmentModules',
                        'regions',
                        e.target.value
                          .split(',')
                          .map((item) => item.trim())
                          .filter(Boolean)
                      )
                    }
                  />
                </Card>

                <Card className="p-4 border border-bg-tertiary md:col-span-2">
                  <div className="flex items-center gap-2 text-primary-400"><CircleDollarSign className="h-4 w-4" /> Faixas de preço</div>
                  <p className="text-sm text-neutral-gray mt-2">
                    Configure as faixas de valores dos imóveis que sua empresa trabalha.
                  </p>
                  <Input
                    className="mt-3"
                    placeholder="Ex.: até 300k, 300k-800k, acima de 800k"
                    value={draft.segmentModules.priceRanges?.join(', ') || ''}
                    onChange={(e) =>
                      updateDraft(
                        'segmentModules',
                        'priceRanges',
                        e.target.value
                          .split(',')
                          .map((item) => item.trim())
                          .filter(Boolean)
                      )
                    }
                  />
                </Card>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-bg-tertiary bg-bg-secondary p-4">
                <p className="text-sm text-neutral-gray">Não quer configurar agora? Você pode seguir e fazer isso depois no dashboard.</p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => updateDraft('segmentModules', 'configureLater', true)}
                >
                  Configurar depois
                </Button>
              </div>
            </section>
          )}

          {currentStep === 'agent' && (
            <section className="space-y-5">
              <header>
                <h2 className="text-2xl font-semibold">Configuração do Agente IA</h2>
                <p className="text-sm text-neutral-gray mt-1">Tom de voz, gatilhos de transferência e mensagem inicial.</p>
              </header>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Nome do agente"
                  value={draft.agent.agentName || ''}
                  onChange={(e) => updateDraft('agent', 'agentName', e.target.value)}
                />

                <label className="space-y-2">
                  <span className="text-sm text-neutral-gray">Personalidade</span>
                  <select
                    className="h-10 w-full rounded-lg border border-bg-tertiary bg-bg-secondary px-3"
                    value={draft.agent.personality || state?.recommendations.suggestedPersonality || 'PROFISSIONAL'}
                    onChange={(e) => updateDraft('agent', 'personality', e.target.value)}
                  >
                    <option value="PROFISSIONAL">Profissional</option>
                    <option value="CONSULTIVO">Consultivo</option>
                    <option value="ASSERTIVO">Assertivo</option>
                    <option value="AMIGAVEL">Amigável</option>
                  </select>
                </label>
              </div>

              <label className="space-y-2 block">
                <span className="text-sm text-neutral-gray">Mensagem de boas-vindas</span>
                <textarea
                  rows={4}
                  className="w-full rounded-lg border border-bg-tertiary bg-bg-secondary px-3 py-2"
                  value={
                    draft.agent.welcomeMessage ||
                    state?.recommendations.suggestedWelcomeMessage ||
                    ''
                  }
                  onChange={(e) => updateDraft('agent', 'welcomeMessage', e.target.value)}
                />
              </label>
            </section>
          )}

          {currentStep === 'routing' && (
            <section className="space-y-5">
              <header>
                <h2 className="text-2xl font-semibold">Regras de Roteamento</h2>
                <p className="text-sm text-neutral-gray mt-1">Como os leads serão distribuídos para o time.</p>
              </header>

              <label className="space-y-2 block">
                <span className="text-sm text-neutral-gray">Modo de distribuição</span>
                <select
                  className="h-10 w-full rounded-lg border border-bg-tertiary bg-bg-secondary px-3"
                  value={
                    draft.routing.distributionMode ||
                    state?.recommendations.suggestedDistributionMode ||
                    'AUTOMATIC'
                  }
                  onChange={(e) => updateDraft('routing', 'distributionMode', e.target.value)}
                >
                  <option value="AUTOMATIC">Automático</option>
                  <option value="ROUND_ROBIN">Round-robin</option>
                  <option value="MANUAL">Manual</option>
                </select>
              </label>

              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(draft.routing.prioritizeAvailable ?? true)}
                  onChange={(e) => updateDraft('routing', 'prioritizeAvailable', e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm text-neutral-gray">Priorizar agentes disponíveis</span>
              </label>
            </section>
          )}

          {currentStep === 'integrations' && (
            <section className="space-y-5">
              <header>
                <h2 className="text-2xl font-semibold">Integrações Prioritárias</h2>
                <p className="text-sm text-neutral-gray mt-1">Selecione o que deseja conectar na primeira fase.</p>
              </header>

              <div className="grid gap-3 md:grid-cols-3">
                {[
                  { key: 'whatsappConnected', label: 'WhatsApp', icon: Building2 },
                  { key: 'calendarConnected', label: 'Google Calendar', icon: Route },
                  { key: 'smtpConnected', label: 'SMTP', icon: Building2 },
                ].map((item) => (
                  <label
                    key={item.key}
                    className={`rounded-lg border p-4 cursor-pointer ${
                      draft.integrations[item.key]
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-bg-tertiary bg-bg-secondary'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(draft.integrations[item.key])}
                      onChange={(e) => updateDraft('integrations', item.key, e.target.checked)}
                      className="sr-only"
                    />
                    <item.icon className="h-5 w-5 text-primary-400" />
                    <p className="mt-2 text-sm font-medium">{item.label}</p>
                  </label>
                ))}
              </div>
            </section>
          )}

          {currentStep === 'review' && (
            <section className="space-y-5">
              <header>
                <h2 className="text-2xl font-semibold">Revisão Final</h2>
                <p className="text-sm text-neutral-gray mt-1">Seu ambiente está quase pronto para operar.</p>
              </header>

              <div className="grid gap-3 md:grid-cols-2">
                <Card className="p-4 border border-bg-tertiary">
                  <p className="text-sm text-neutral-gray">Empresa</p>
                  <p className="mt-1 font-medium">{draft.company.name || 'Não informado'}</p>
                  <p className="text-sm text-neutral-gray mt-2">{draft.company.city || 'Cidade não definida'}</p>
                </Card>

                <Card className="p-4 border border-bg-tertiary">
                  <p className="text-sm text-neutral-gray">Segmento</p>
                  <p className="mt-1 font-medium">{businessType}</p>
                  <p className="text-sm text-neutral-gray mt-2">Módulos ativos: {state?.tenant.activeModules.length || 0}</p>
                </Card>
              </div>

              <div className="rounded-xl border border-primary-500/30 bg-primary-500/10 p-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary-300" />
                  <p className="text-sm font-medium text-primary-300">Recomendação HublaIA</p>
                </div>
                <div className="mt-2 text-sm text-neutral-gray flex items-center gap-2">
                  <span>Personalidade ideal:</span>
                  <Badge variant="blue">{state?.recommendations.suggestedPersonality}</Badge>
                </div>
              </div>

              <div className="rounded-xl border border-bg-tertiary bg-bg-secondary p-4 space-y-3">
                <p className="text-sm font-medium">Finalização inteligente</p>

                <label className="inline-flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={completionOptions.provisionDefaults}
                    onChange={(e) =>
                      setCompletionOptions((prev) => ({
                        ...prev,
                        provisionDefaults: e.target.checked,
                      }))
                    }
                    className="mt-1 h-4 w-4"
                  />
                  <span className="text-sm text-neutral-gray">
                    Criar estrutura operacional padrão para iniciar atendimento rapidamente.
                  </span>
                </label>

                <label className="inline-flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={completionOptions.createDefaultPrompt}
                    onChange={(e) =>
                      setCompletionOptions((prev) => ({
                        ...prev,
                        createDefaultPrompt: e.target.checked,
                      }))
                    }
                    className="mt-1 h-4 w-4"
                  />
                  <span className="text-sm text-neutral-gray">
                    Gerar prompt inicial recomendado para seu segmento automaticamente.
                  </span>
                </label>
              </div>
            </section>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-bg-tertiary pt-6">
            <Button variant="secondary" onClick={goToPrevious} disabled={activeSteps.indexOf(currentStep) === 0 || isSaving}>
              Voltar
            </Button>

            <div className="flex items-center gap-3">
              {currentStep === 'review' ? (
                <Button onClick={handleComplete} isLoading={isSaving}>
                  Finalizar onboarding
                </Button>
              ) : (
                <Button onClick={saveCurrentStep} isLoading={isSaving}>
                  Salvar e continuar
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
