# HublaIA

Plataforma SaaS para automacao de atendimento, qualificacao de leads e operacao multi-tenant com onboarding dinamico por segmento.

## Visao Geral

HublaIA combina:
- Backend NestJS + Prisma para dominio, seguranca e multi-tenant.
- Frontend Next.js (App Router) para onboarding, dashboard e operacao.
- PostgreSQL e Redis para persistencia e filas.
- Arquitetura modular com modulos core e modulos por segmento.

## Principais Recursos

- Onboarding dinamico por tipo de negocio.
- Controle de acesso por modulo no backend (nao apenas frontend).
- Fluxo de autenticacao com JWT e suporte a login Google.
- Gestao de leads, agentes, filas e roteamento.
- Base preparada para extensao de novos segmentos sem duplicar entidades.

## Arquitetura do Projeto

```text
hublaia/
  apps/
    backend/       # API NestJS
    frontend/      # Frontend legado (Vite)
    frontend-new/  # Frontend principal (Next.js)
  prisma/          # Schema, migrations e seed
  docker-compose.yml
```

Documentacao tecnica da arquitetura de onboarding dinamico:
- ONBOARDING_DYNAMIC_ARCHITECTURE.md

## Stack Tecnica

Backend:
- NestJS 10
- Prisma ORM
- PostgreSQL
- Redis + Bull
- Jest + ESLint + TypeScript

Frontend principal:
- Next.js 15
- React 18
- TypeScript
- TailwindCSS
- Framer Motion

## Requisitos

- Node.js 18+
- npm 9+
- Docker + Docker Compose (recomendado para DB/Redis)

## Setup Rapido

### 1) Clonar e instalar dependencias

```bash
git clone https://github.com/GiovanneMedeiros/HublaIA.git
cd HublaIA
npm install
```

### 2) Subir infraestrutura (Postgres + Redis)

```bash
docker compose up -d
```

### 3) Configurar ambiente

- Ajuste os arquivos .env conforme necessario.
- O backend possui exemplo em apps/backend/.env.example.
- O frontend principal possui exemplo em apps/frontend-new/.env.example.

### 4) Banco de dados (Prisma)

```bash
cd apps/backend
npm run db:migrate
npm run db:seed
```

### 5) Rodar backend

```bash
cd apps/backend
npm install
npm run start:dev
```

### 6) Rodar frontend principal

```bash
cd apps/frontend-new
npm install
npm run dev
```

## Enderecos Locais

- Frontend principal: http://localhost:3000
- Backend API: http://localhost:3333
- Prisma Studio: http://localhost:5555

## Scripts Importantes

Backend (apps/backend):
- npm run start:dev
- npm run typecheck
- npm run lint
- npm test
- npm run build

Frontend principal (apps/frontend-new):
- npm run dev
- npm run type-check
- npm run lint
- npm run build

## Seguranca e Multi-tenant

- Tenant guard no backend para isolamento entre empresas.
- Validacao de acesso por modulo no backend.
- Cookies HttpOnly e fluxo autenticado com credenciais.
- Estrutura pronta para RBAC e endurecimento incremental.

## Roadmap Sugerido

- Completar estabilizacao das suites legadas de teste backend.
- Expandir modulos por segmento alem de REAL_ESTATE.
- Adicionar observabilidade (logs estruturados + metricas).
- Pipeline CI com checks obrigatorios (typecheck, lint, test, build).

## Contribuicao

1. Crie uma branch de feature.
2. Faça commits pequenos e descritivos.
3. Execute validacoes locais antes do push.
4. Abra PR com contexto tecnico e impacto.

## Licenca

MIT
