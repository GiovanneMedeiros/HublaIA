# HublaIA Frontend

Uma aplicação Next.js 15 enterprise-grade para HublaIA - plataforma de automação de WhatsApp com IA.

## Stack Tecnológico

- **Next.js 15** - React framework com App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Shadcn/UI** - Headless components
- **Framer Motion** - Animations
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **TanStack Query** - Server state management
- **Zustand** - Global UI state
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Lucide React** - Icons

## Requisitos

- Node.js 18+
- npm 9+
- Backend NestJS rodando em http://localhost:3333

## Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
# .env.local deve conter:
# NEXT_PUBLIC_API_URL=http://localhost:3333/api
```

## Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Abrir em http://localhost:3000
```

## Build & Deploy

```bash
# Build para produção
npm run build

# Iniciar servidor de produção
npm start
```

## Estrutura de Pastas

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   ├── globals.css        # Global styles
│   ├── auth/              # Auth pages
│   └── dashboard/         # Dashboard pages
├── components/
│   ├── atoms/             # Basic components (Button, Input, Card)
│   ├── molecules/         # Composed components
│   ├── organisms/         # Complex components
│   └── layouts/           # Layout components
├── features/              # Feature modules
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities (cn, api)
├── services/              # API services
├── store/                 # Zustand stores
├── types/                 # TypeScript types
├── constants/             # App constants
├── styles/                # Global styles
└── assets/                # Static assets
```

## Credenciais Demo

```
Email: admin@hublaia-demo.com
Senha: admin123
```

## API Endpoints

- `POST /auth/login` - Login
- `GET /leads` - Listar leads
- `GET /agents` - Listar agents
- `POST /conversations` - Criar conversa
- `GET /conversations/:id` - Obter conversa

## Padrões de Código

### Componentes

```tsx
// Usar componentes funcionais com TypeScript
'use client'; // Para componentes interativos

import React from 'react';

export interface MyComponentProps {
  title: string;
  variant?: 'primary' | 'secondary';
}

export function MyComponent({ title, variant = 'primary' }: MyComponentProps) {
  return <div>{title}</div>;
}
```

### Services

```tsx
// Services chamam a API
export const myService = {
  getData: async () => {
    const response = await api.get('/endpoint');
    return response.data.data;
  },
};
```

### Hooks

```tsx
// Hooks para lógica reutilizável
export function useMyHook() {
  const [state, setState] = React.useState();
  return { state };
}
```

## Temas e Cores

Sistema de cores dark-mode com palette:

- **Primary**: #4F46E5
- **Accent**: #7C3AED
- **Status Blue**: #3B82F6
- **Status Yellow**: #F59E0B
- **Status Green**: #10B981
- **Status Red**: #EF4444

## Animações

- Duração máxima: 300ms
- Easing: ease-out
- Entradas: fade + slide
- Hovers: scale + glow

## Contribuindo

1. Criar branch feature: `git checkout -b feature/my-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push: `git push origin feature/my-feature`
4. Abrir Pull Request

## License

Proprietary - HublaIA 2024
