# TURBOREPO POC - PROJECT SPECIFICATION

## 1. Contexto e Objetivo
Este projeto é uma Proof of Concept (PoC) para demonstrar a viabilidade de uma arquitetura Monorepo usando **Turborepo** (pnpm).
O objetivo é simular um ecossistema com múltiplos microserviços (NestJS) e múltiplos frontends (TanStack Start) compartilhando código, tipos e lógica de autenticação.
O foco é a demonstração do turborepo, então lembre-se de usar seus recursos para a implementação.
A TIPAGEM É OBRIGATÓRIA. O SUO DE DTO, ENTIDADES, TIPAGEM É MANDATÓRIA E INEGOCIÁVEL. NUNCA USE TIPOS GENÉRICOS OU any.

## 2. Tech Stack & Ferramentas
- **Monorepo Manager:** Turborepo.
- **Package Manager:** pnpm (Workspaces).
- **Backend:** NestJS (Modo Standalone).
- **Frontend:** TanStack Start (React).
- **Linguagem:** TypeScript.
- **Prefixo de Pacotes:** `@turborepo/*` (ex: `@turborepo/ui`, `@turborepo/dtos`).

## 3. Estado Atual da Estrutura (Já Criado)
Os projetos já foram inicializados. O foco agora é **configuração e implementação**.

/apps
  /api-auth           (NestJS - pnpm)
  /api-orders         (NestJS - pnpm)
  /api-analytics      (NestJS - pnpm)
  /webapp-client      (TanStack Start - pnpm)
  /webapp-admin       (TanStack Start - pnpm)

/packages
  /dtos               (Iniciado com pnpm init, sem deps)
  /ui                 (React Components)
  /auth               (Novo: SDK de Autenticação compartilhado)
  /eslint-config      (Configuração de Linting)
  /typescript-config  (Configuração de TS Base)

## 4. Regras de Arquitetura (CRÍTICO)

### A. Configuração Base (Shared Configs)
- Os pacotes `typescript-config` e `eslint-config` devem ser configurados primeiro.
- Todos os `apps/*` e `packages/*` devem estender essas configurações base para garantir padronização.

### B. Backend (NestJS)
- **Portas Fixas:** Ajustar `main.ts` de cada serviço:
  - `api-auth`: **3001**
  - `api-orders`: **3002**
  - `api-analytics`: **3003**
- **CORS:** Habilitar CORS (`origin: '*'`) para permitir chamadas dos webapps.
- **Dados:** NÃO usar banco real. Usar arrays em memória.
- **Dependência:** Devem consumir interfaces de `@turborepo/dtos`.

### C. Frontend (TanStack Start)
- **Componentização:** Os webapps NÃO devem ter componentes de UI locais (botões, inputs, cards). **TODOS** os componentes visuais devem ser importados de `@turborepo/ui`.
- **Lógica de Auth:** Deve utilizar o SDK `@turborepo/auth` para gerenciar tokens e requests.
- **Roteamento:** Manter simples, foco na demonstração da integração.

### D. Autenticação (Mock Strategy)
- **Login:** `api-auth` recebe email.
  - Se email conter "admin" -> Role: ADMIN.
  - Caso contrário -> Role: CLIENT.
- **Token:** Base64 do objeto User (Simulação de JWT).
- **Guard:** `api-analytics` deve ter um Guard que valida esse token.

### E. Shared Packages
1.  **@turborepo/dtos:**
    - Exportar `UserRole` (Enum), `IOrder` (Interface), `LoginResponse` (Interface).
2.  **@turborepo/ui:**
    - Exportar componentes React reutilizáveis (Button, Card, Badge, Input).
    - Deve ser agnóstico de negócio.
3.  **@turborepo/auth (SDK):**
    - Exportar utilitários para os Frontends:
      - `saveToken(token)`
      - `getToken()`
      - `isAuthenticated()`
      - `fetchWithAuth(url, options)` (Wrapper que injeta o header Authorization automaticamente).

## 5. Fluxo de Desenvolvimento (Commands)
- Configurar `dev` script no root para subir o ambiente todo.
- Configurar filtros:
  - `dev:client` -> sobe apenas `webapp-client`, `api-auth`, `api-orders`.

## 6. Passo a Passo para Execução (Ordem Lógica)
1.  **Wiring:** Configurar `packages/typescript-config` e `packages/eslint-config` e aplicar em todos os `apps` e `packages`.
2.  **DTOs:** Implementar interfaces em `@turborepo/dtos`.
3.  **Auth SDK:** Implementar lógica de helper em `@turborepo/auth`.
4.  **UI Lib:** Criar componentes básicos em `@turborepo/ui`.
5.  **Linkagem:** Garantir que os apps tenham as dependências locais no `package.json` (ex: `"@turborepo/dtos": "workspace:*"`).
6.  **Backend Impl:**
    - Configurar portas e CORS.
    - Implementar lógica de Auth Mock.
    - Implementar CRUD Orders.
    - Implementar Guard no Analytics.
7.  **Frontend Impl:**
    - Conectar `webapp-client` e `webapp-admin` usando os pacotes criados.
