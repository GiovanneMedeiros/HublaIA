# Arquitetura de Onboarding Dinamico por Segmento

## Objetivo

Evoluir o onboarding para um modelo multi-segmento, sem duplicar entidades e sem acoplar o sistema apenas ao segmento imobiliario.

Principios aplicados:
- Arquitetura modular e extensivel por tipo de negocio.
- Reuso de modulos core entre todos os segmentos.
- Ativacao de modulos por tenant no backend.
- Controle de acesso no backend (nao confiar apenas no frontend).
- Compatibilidade com funcionalidades existentes.

## Visao Geral

O onboarding passa a ser orientado por contexto do tenant:
1. Usuario escolhe o segmento da empresa.
2. Backend calcula modulos habilitados para o segmento.
3. Backend retorna etapas dinamicas do onboarding.
4. Frontend renderiza fluxo conforme etapas e menu retornados.
5. Endpoints de modulos especificos sao protegidos por guard de modulo.

## Modelo de Dados

Base em [prisma/schema.prisma](prisma/schema.prisma):
- Company: agregado principal do tenant.
- TenantOnboarding: estado/progresso das etapas.
- TenantBusinessProfile: perfil de negocio/segmento.
- TenantAgentSetting: configuracoes iniciais do agente.
- TenantRoutingRule: regras iniciais de distribuicao.

Nao ha duplicacao por segmento: o comportamento dinamico eh orientado por metadados e modulos ativos.

## Catalogo de Modulos

O catalogo central define:
- Tipos de negocio suportados.
- Modulos core (sempre candidatos).
- Modulos especificos por segmento.
- Menu de dashboard por segmento.

Implementacao: [apps/backend/src/shared/domain/moduleCatalog.ts](apps/backend/src/shared/domain/moduleCatalog.ts)

Responsabilidades principais:
- Normalizar businessType.
- Montar lista de modulos por segmento.
- Mapear legado de segmentacao para businessType novo.
- Definir menu dinamico por segmento.

## Servico de Modulos por Tenant

Implementacao: [apps/backend/src/shared/infrastructure/services/TenantModuleService.ts](apps/backend/src/shared/infrastructure/services/TenantModuleService.ts)

Funcoes:
- Ler contexto do tenant (segmento e modulos ativos).
- Alterar businessType de forma segura.
- Sincronizar modulos ativos com base no catalogo.
- Verificar se modulo esta habilitado.
- Persistir e ler configuracoes por modulo.

Esse servico centraliza regras de ativacao/desativacao para evitar duplicacao de logica em controllers.

## Controle de Acesso por Modulo

Decorador e guard:
- [apps/backend/src/shared/infrastructure/decorators/RequireModule.ts](apps/backend/src/shared/infrastructure/decorators/RequireModule.ts)
- [apps/backend/src/shared/infrastructure/guards/ModuleAccessGuard.ts](apps/backend/src/shared/infrastructure/guards/ModuleAccessGuard.ts)

Fluxo de seguranca:
1. Endpoint declara modulo requerido com decorator.
2. Guard valida tenant autenticado.
3. Guard consulta TenantModuleService.
4. Requisicao eh negada se modulo nao estiver habilitado.

Com isso, acesso nao depende de esconder itens no frontend.

## Orquestracao do Onboarding

Servico principal: [apps/backend/src/modules/onboarding/application/services/OnboardingService.ts](apps/backend/src/modules/onboarding/application/services/OnboardingService.ts)

Capacidades:
- Retornar estado completo com:
  - Progresso.
  - Etapas dinamicas.
  - Contexto de tenant.
  - Menu dinamico.
  - Recomendacoes iniciais.
- Salvar etapa por etapa com validacoes.
- No passo business, sincronizar modulos pelo businessType selecionado.
- Finalizar onboarding com provisionamento opcional.

DTOs atualizados: [apps/backend/src/modules/onboarding/application/dtos/OnboardingDTOs.ts](apps/backend/src/modules/onboarding/application/dtos/OnboardingDTOs.ts)

## APIs de Onboarding e Modulos

Controller: [apps/backend/src/modules/onboarding/infrastructure/controllers/OnboardingController.ts](apps/backend/src/modules/onboarding/infrastructure/controllers/OnboardingController.ts)

Endpoints relevantes:
- GET /onboarding/state
- POST /onboarding/step/:step
- POST /onboarding/complete
- GET /onboarding/modules/check/:moduleKey
- GET /onboarding/real-estate/property-providers
- POST /onboarding/real-estate/property-providers/:providerKey/request

Os endpoints de provider imobiliario usam controle de modulo no backend.

## Frontend: Onboarding Dinamico

Tela principal:
- [apps/frontend-new/src/app/onboarding/page.tsx](apps/frontend-new/src/app/onboarding/page.tsx)

Servico:
- [apps/frontend-new/src/services/onboarding.service.ts](apps/frontend-new/src/services/onboarding.service.ts)

Tipos:
- [apps/frontend-new/src/types/index.ts](apps/frontend-new/src/types/index.ts)

Comportamento:
- Etapas exibidas conforme dynamicSteps retornado pela API.
- Segmento escolhido no passo business direciona modulos e menu.
- Para REAL_ESTATE existe etapa segmentModules com cards de configuracao.
- Integracoes de provider imobiliario possuem estado e acao de solicitacao.

Pagina de providers:
- [apps/frontend-new/src/app/onboarding/real-estate/properties/page.tsx](apps/frontend-new/src/app/onboarding/real-estate/properties/page.tsx)

## Frontend: Menu Dinamico de Dashboard

Dashboard atualizado para consumir menu retornado pelo onboarding state:
- [apps/frontend-new/src/app/dashboard/page.tsx](apps/frontend-new/src/app/dashboard/page.tsx)

Comportamento:
- Sidebar usa menu dinamico quando disponivel.
- Mantem fallback para menu minimo.
- Rotas de modulos sem tela final possuem placeholders para evitar 404 imediato.

## Como Adicionar Novo Segmento

1. Declarar o novo businessType no catalogo.
2. Definir modulos especificos do segmento.
3. Definir menu de dashboard do segmento.
4. Se necessario, criar nova etapa dinamica no OnboardingService.
5. Proteger endpoints novos com RequireModule + ModuleAccessGuard.
6. Implementar UI do modulo no frontend sem alterar entidades core.

## Garantias de Escalabilidade

- Catalogo central evita logicas espalhadas por if/else em diversos modulos.
- Servico de modulo desacopla regra de habilitacao do controller.
- Entidades permanecem genericas e multi-tenant.
- Fluxo de onboarding evolui por metadados (etapas dinamicas), nao por forks de codigo.

## Observacoes de Validacao

Status atual de validacao apos alteracoes:
- Backend typecheck: ok.
- Backend lint: ok (com warnings).
- Backend tests: falhando em suites legadas com imports quebrados.
- Backend build: ok.
- Frontend-new type-check: ok.
- Frontend-new lint: ok (com warnings).
- Frontend-new build: possui falhas preexistentes na pagina /pricing e prerender /404.

As falhas remanescentes nao estao no fluxo novo de onboarding dinamico, mas em suites legadas e paginas existentes fora desse escopo.
