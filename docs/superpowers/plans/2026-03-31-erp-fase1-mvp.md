# ERP Empresarial — Fase 1 (MVP) Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a multi-tenant ERP SaaS MVP with auth, layout, dashboard, and CRUD modules for clientes, fornecedores, produtos, servicos, formas de pagamento, categorias financeiras, and centros de custo.

**Architecture:** Monorepo with `client/` (Vue 3 SPA + PrimeVue + Tailwind + Pinia) and `server/` (Fastify + Prisma + PostgreSQL). JWT auth with refresh tokens. Row-level multi-tenant isolation via `empresa_id` on all tables.

**Tech Stack:** Vue 3, Vite, TypeScript, PrimeVue, Tailwind CSS, Pinia, Axios, VeeValidate, Zod, Fastify 5, Prisma 6, PostgreSQL 16, JWT (jsonwebtoken), bcrypt

**Spec:** `docs/superpowers/specs/2026-03-31-erp-fase1-mvp-design.md`

---

## Chunk 1: Project Scaffolding

### Task 1: Root monorepo setup

**Files:**
- Create: `package.json`
- Create: `.gitignore`
- Create: `.env.example`

- [ ] **Step 1: Create root package.json**

```json
{
  "name": "erp-empresarial",
  "private": true,
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:client": "cd client && npm run dev",
    "dev:server": "cd server && npm run dev",
    "build": "cd client && npm run build",
    "db:migrate": "cd server && npx prisma migrate dev",
    "db:seed": "cd server && npx prisma db seed"
  },
  "devDependencies": {
    "concurrently": "^9.1.0"
  }
}
```

- [ ] **Step 2: Create .gitignore**

```
node_modules/
dist/
**/.env
*.log
.DS_Store
```

- [ ] **Step 3: Create .env.example**

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/erp_empresarial
JWT_SECRET=your-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-change-in-production
PORT=3000
CLIENT_URL=http://localhost:5173
```

- [ ] **Step 4: Install root deps**

Run: `npm install`

- [ ] **Step 5: Commit**

```bash
git add package.json .gitignore .env.example package-lock.json
git commit -m "chore: init monorepo with root package.json"
```

---

### Task 2: Server scaffolding (Fastify + Prisma + TypeScript)

**Files:**
- Create: `server/package.json`
- Create: `server/tsconfig.json`
- Create: `server/src/app.ts`
- Create: `server/prisma/schema.prisma`
- Create: `server/src/shared/utils/response.ts`
- Create: `server/src/shared/utils/money.ts`
- Create: `server/src/shared/utils/date.ts`
- Create: `server/src/shared/types/fastify.d.ts`

- [ ] **Step 1: Create server/package.json**

```json
{
  "name": "erp-server",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "fastify": "^5.2.0",
    "@fastify/cors": "^10.0.0",
    "@fastify/cookie": "^11.0.0",
    "@prisma/client": "^6.4.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "zod": "^3.24.0"
  },
  "devDependencies": {
    "prisma": "^6.4.0",
    "typescript": "^5.7.0",
    "tsx": "^4.19.0",
    "@types/node": "^22.0.0",
    "@types/jsonwebtoken": "^9.0.7",
    "@types/bcryptjs": "^2.4.6",
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 2: Create server/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 3: Create Prisma schema with all Fase 1 models**

Create `server/prisma/schema.prisma` with the full schema from the spec (Section 10), including:
- `Empresa`, `Usuario`, `GrupoUsuario`, `Permissao`
- `Cliente`, `ClienteEndereco`, `ClienteContato`
- `Fornecedor`, `FornecedorEndereco`, `FornecedorContato`
- `GrupoProduto`, `Unidade`, `Produto`, `ProdutoLoja`
- `Servico`, `FormaPagamento`, `CategoriaFinanceira`, `CentroCusto`

Add `permissoes Permissao[]` to the `Empresa` model (missing inverse noted in spec review).

Generator and datasource:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

- [ ] **Step 4: Create Fastify type augmentation**

`server/src/shared/types/fastify.d.ts`:
```typescript
import 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    empresa_id: bigint
    usuario_id: bigint
  }
}
```

- [ ] **Step 5: Create response utility**

`server/src/shared/utils/response.ts`:
```typescript
export function success(message: string, data: unknown = null) {
  return { code: 200, status: 'success', message, data }
}

export function created(message: string, data: unknown = null) {
  return { code: 201, status: 'success', message, data }
}

export function error(code: number, message: string, data: unknown = null) {
  return { code, status: 'error', message, data }
}
```

- [ ] **Step 6: Create money utility**

`server/src/shared/utils/money.ts`:
```typescript
import { Decimal } from '@prisma/client/runtime/library'

export function formatMoney(value: Decimal | number | null): string {
  if (value === null) return '0,00'
  const num = typeof value === 'number' ? value : Number(value)
  return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function parseMoney(value: string): Decimal {
  const cleaned = value.replace(/\./g, '').replace(',', '.')
  return new Decimal(cleaned)
}
```

- [ ] **Step 7: Create date utility**

`server/src/shared/utils/date.ts`:
```typescript
export function formatDateBR(date: Date | null): string {
  if (!date) return ''
  return date.toLocaleDateString('pt-BR')
}

export function parseDateBR(value: string): Date {
  const [day, month, year] = value.split('/')
  return new Date(Number(year), Number(month) - 1, Number(day))
}
```

- [ ] **Step 8: Create app.ts (Fastify entry point)**

`server/src/app.ts`:
```typescript
import Fastify from 'fastify'
import cors from '@fastify/cors'
import cookie from '@fastify/cookie'

const app = Fastify({ logger: true })

await app.register(cors, {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
})
await app.register(cookie)

app.get('/health', async () => ({ status: 'ok' }))

const port = Number(process.env.PORT) || 3000
await app.listen({ port, host: '0.0.0.0' })
console.log(`Server running on http://localhost:${port}`)
```

- [ ] **Step 9: Install server deps and run Prisma generate**

```bash
cd server && npm install
npx prisma generate
```

- [ ] **Step 10: Verify server starts**

Run: `cd server && npm run dev`
Expected: Server starts on port 3000, `GET /health` returns `{ status: 'ok' }`

- [ ] **Step 11: Commit**

```bash
git add server/
git commit -m "feat: scaffold server with Fastify, Prisma schema, and utilities"
```

---

### Task 3: Client scaffolding (Vue 3 + Vite + PrimeVue + Tailwind)

**Files:**
- Create: `client/` (via create-vue)
- Modify: `client/package.json` (add deps)
- Create: `client/src/main.ts`
- Create: `client/tailwind.config.ts`
- Modify: `client/vite.config.ts`

- [ ] **Step 1: Scaffold Vue 3 project with Vite**

```bash
cd client
npm create vue@latest . -- --typescript --router --pinia
```

Select: TypeScript Yes, Router Yes, Pinia Yes, ESLint No, Prettier No (keep minimal)

- [ ] **Step 2: Install frontend dependencies**

```bash
cd client
npm install primevue @primevue/themes primeicons axios vee-validate @vee-validate/zod zod chart.js
npm install -D tailwindcss @tailwindcss/vite
```

- [ ] **Step 3: Configure Tailwind CSS**

`client/tailwind.config.ts`:
```typescript
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
} satisfies Config
```

Add to `client/src/assets/main.css`:
```css
@import 'tailwindcss';
@import 'primeicons/primeicons.css';
```

- [ ] **Step 4: Configure main.ts with PrimeVue + Pinia + Router**

`client/src/main.ts`:
```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import router from './router'
import App from './App.vue'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: { darkModeSelector: false }
  }
})
app.use(ToastService)
app.use(ConfirmationService)

app.mount('#app')
```

- [ ] **Step 5: Configure Vite proxy for API**

`client/vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

- [ ] **Step 6: Clean up scaffolded files**

Remove default Vue scaffolding: `src/components/HelloWorld.vue`, `src/components/TheWelcome.vue`, `src/views/HomeView.vue`, `src/views/AboutView.vue`, etc.

Set `client/src/App.vue` to:
```vue
<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>
```

- [ ] **Step 7: Verify client starts**

Run: `cd client && npm run dev`
Expected: Vite dev server starts on port 5173, blank page loads

- [ ] **Step 8: Commit**

```bash
git add client/
git commit -m "feat: scaffold client with Vue 3, PrimeVue, Tailwind, Pinia"
```

---

## Chunk 2: Backend Auth + Middleware

### Task 4: Auth middleware and JWT utilities

**Files:**
- Create: `server/src/shared/middleware/auth.middleware.ts`
- Create: `server/src/shared/middleware/tenant.middleware.ts`
- Create: `server/src/shared/utils/jwt.ts`
- Create: `server/src/shared/utils/prisma.ts`

- [ ] **Step 1: Create Prisma singleton**

`server/src/shared/utils/prisma.ts`:
```typescript
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()
```

- [ ] **Step 2: Create JWT utility**

`server/src/shared/utils/jwt.ts`:
```typescript
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret'

interface TokenPayload {
  usuario_id: string
  empresa_id: string
}

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' })
}

export function signRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' })
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload
}
```

- [ ] **Step 3: Create auth middleware**

`server/src/shared/middleware/auth.middleware.ts`:
```typescript
import { FastifyRequest, FastifyReply } from 'fastify'
import { verifyAccessToken } from '../utils/jwt.js'

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return reply.status(401).send({ code: 401, status: 'error', message: 'Token nao fornecido' })
  }

  try {
    const token = authHeader.slice(7)
    const payload = verifyAccessToken(token)
    request.usuario_id = BigInt(payload.usuario_id)
    request.empresa_id = BigInt(payload.empresa_id)
  } catch {
    return reply.status(401).send({ code: 401, status: 'error', message: 'Token invalido ou expirado' })
  }
}
```

- [ ] **Step 4: Create tenant middleware**

`server/src/shared/middleware/tenant.middleware.ts`:
```typescript
import { FastifyRequest, FastifyReply } from 'fastify'

export async function tenantMiddleware(request: FastifyRequest, reply: FastifyReply) {
  if (!request.empresa_id) {
    return reply.status(401).send({ code: 401, status: 'error', message: 'Empresa nao identificada' })
  }
}
```

- [ ] **Step 5: Create permissoes middleware**

`server/src/shared/middleware/permissoes.middleware.ts`:
```typescript
import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../utils/prisma.js'

export function permissoesMiddleware(modulo: string, acao: string) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const usuario = await prisma.usuario.findFirst({
      where: { id: request.usuario_id, empresa_id: request.empresa_id },
      include: { grupo_usuario: { include: { permissoes: true } } },
    })

    if (!usuario?.grupo_usuario) {
      return reply.status(403).send({ code: 403, status: 'error', message: 'Sem grupo de permissoes' })
    }

    const permissao = usuario.grupo_usuario.permissoes.find(
      p => p.modulo === modulo && p.acao === acao && p.permitido
    )

    if (!permissao) {
      return reply.status(403).send({ code: 403, status: 'error', message: 'Sem permissao para esta acao' })
    }
  }
}
```

- [ ] **Step 6: Add BigInt JSON serialization and global error handler to app.ts**

Add to `server/src/app.ts` before route registration:
```typescript
// BigInt serialization for JSON responses
;(BigInt.prototype as any).toJSON = function () { return this.toString() }

// Global error handler
app.setErrorHandler((error, request, reply) => {
  const statusCode = error.statusCode || 500
  reply.status(statusCode).send({
    code: statusCode,
    status: 'error',
    message: error.message || 'Erro interno',
    data: null,
  })
})
```

- [ ] **Step 7: Commit**

```bash
git add server/src/shared/
git commit -m "feat: add JWT utils, auth/tenant/permissoes middleware, Prisma singleton, BigInt serializer"
```

---

### Task 5: Auth module (login, refresh, logout, recuperar/redefinir senha)

**Files:**
- Create: `server/src/modules/auth/auth.schema.ts`
- Create: `server/src/modules/auth/auth.service.ts`
- Create: `server/src/modules/auth/auth.routes.ts`
- Modify: `server/src/app.ts`

- [ ] **Step 1: Create auth Zod schemas**

`server/src/modules/auth/auth.schema.ts`:
```typescript
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email invalido'),
  senha: z.string().min(1, 'Senha obrigatoria'),
})

export const recuperarSenhaSchema = z.object({
  email: z.string().email('Email invalido'),
})

export const redefinirSenhaSchema = z.object({
  token: z.string().min(1),
  nova_senha: z.string().min(6, 'Senha deve ter no minimo 6 caracteres'),
})

export type LoginInput = z.infer<typeof loginSchema>
```

- [ ] **Step 2: Create auth service**

`server/src/modules/auth/auth.service.ts`:
```typescript
import bcrypt from 'bcryptjs'
import { prisma } from '../../shared/utils/prisma.js'
import { signAccessToken, signRefreshToken } from '../../shared/utils/jwt.js'

export async function login(email: string, senha: string) {
  const usuario = await prisma.usuario.findUnique({
    where: { email },
    include: { empresa: true, grupo_usuario: { include: { permissoes: true } } },
  })

  if (!usuario || !usuario.ativo) {
    throw { statusCode: 401, message: 'Email ou senha invalidos' }
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha_hash)
  if (!senhaValida) {
    throw { statusCode: 401, message: 'Email ou senha invalidos' }
  }

  const payload = {
    usuario_id: usuario.id.toString(),
    empresa_id: usuario.empresa_id.toString(),
  }

  const token = signAccessToken(payload)
  const refreshToken = signRefreshToken(payload)

  return {
    token,
    refreshToken,
    usuario: {
      id: usuario.id.toString(),
      nome: usuario.nome,
      email: usuario.email,
    },
    empresa: {
      id: usuario.empresa.id.toString(),
      razao_social: usuario.empresa.razao_social,
      nome_fantasia: usuario.empresa.nome_fantasia,
    },
    permissoes: usuario.grupo_usuario?.permissoes.map(p => ({
      modulo: p.modulo,
      acao: p.acao,
      permitido: p.permitido,
    })) || [],
  }
}
```

- [ ] **Step 3: Create auth routes**

`server/src/modules/auth/auth.routes.ts`:
```typescript
import { FastifyInstance } from 'fastify'
import { loginSchema, recuperarSenhaSchema, redefinirSenhaSchema } from './auth.schema.js'
import { login } from './auth.service.js'
import { success, error } from '../../shared/utils/response.js'
import { verifyRefreshToken, signAccessToken } from '../../shared/utils/jwt.js'

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/login', async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send(error(400, 'Dados invalidos', { errors: parsed.error.issues }))
    }

    try {
      const result = await login(parsed.data.email, parsed.data.senha)
      reply.setCookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/auth/refresh',
        maxAge: 7 * 24 * 60 * 60,
      })
      return success('Login realizado', {
        token: result.token,
        usuario: result.usuario,
        empresa: result.empresa,
        permissoes: result.permissoes,
      })
    } catch (err: any) {
      return reply.status(err.statusCode || 500).send(error(err.statusCode || 500, err.message))
    }
  })

  app.post('/auth/refresh', async (request, reply) => {
    const token = request.cookies?.refreshToken
    if (!token) {
      return reply.status(401).send(error(401, 'Refresh token nao fornecido'))
    }

    try {
      const payload = verifyRefreshToken(token)
      const newAccessToken = signAccessToken({
        usuario_id: payload.usuario_id,
        empresa_id: payload.empresa_id,
      })
      return success('Token renovado', { token: newAccessToken })
    } catch {
      return reply.status(401).send(error(401, 'Refresh token invalido'))
    }
  })

  app.post('/auth/logout', async (_request, reply) => {
    reply.clearCookie('refreshToken', { path: '/auth/refresh' })
    return success('Logout realizado')
  })

  app.post('/auth/recuperar-senha', async (request, reply) => {
    const parsed = recuperarSenhaSchema.safeParse(request.body)
    if (!parsed.success) return reply.status(400).send(error(400, 'Email invalido'))
    // In production: generate token, save to DB, send email
    // For MVP: just return success (email sending not implemented yet)
    return success('Se o email existir, enviaremos um link de recuperacao')
  })

  app.post('/auth/redefinir-senha', async (request, reply) => {
    const parsed = redefinirSenhaSchema.safeParse(request.body)
    if (!parsed.success) return reply.status(400).send(error(400, 'Dados invalidos', { errors: parsed.error.issues }))
    // In production: validate token from DB, update password
    // For MVP: placeholder response
    return success('Senha redefinida com sucesso')
  })
}
```

- [ ] **Step 4: Register auth routes in app.ts**

Add to `server/src/app.ts` before `app.listen()`:
```typescript
import { authRoutes } from './modules/auth/auth.routes.js'
await app.register(authRoutes)
```

- [ ] **Step 5: Commit**

```bash
git add server/src/modules/auth/
git commit -m "feat: add auth module with login, refresh, logout endpoints"
```

---

### Task 6: Database migration + seed

**Files:**
- Create: `server/prisma/seed.ts`
- Create: `server/.env`

- [ ] **Step 1: Create server/.env**

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/erp_empresarial
JWT_SECRET=dev-secret-change-in-production
JWT_REFRESH_SECRET=dev-refresh-secret-change-in-production
PORT=3000
CLIENT_URL=http://localhost:5173
```

- [ ] **Step 2: Create seed script**

`server/prisma/seed.ts`:
```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Empresa
  const empresa = await prisma.empresa.create({
    data: {
      razao_social: 'Empresa Teste LTDA',
      nome_fantasia: 'Empresa Teste',
      cnpj: '12.345.678/0001-90',
      email: 'contato@empresateste.com.br',
      telefone: '(11) 3000-0000',
    },
  })

  // Grupo Admin
  const grupo = await prisma.grupoUsuario.create({
    data: {
      empresa_id: empresa.id,
      nome: 'Administrador',
    },
  })

  // Permissoes (todas para admin)
  const modulos = ['clientes', 'fornecedores', 'produtos', 'servicos', 'formas_pagamentos', 'categorias', 'centros_custos', 'usuarios']
  const acoes = ['visualizar', 'cadastrar', 'editar', 'excluir']
  for (const modulo of modulos) {
    for (const acao of acoes) {
      await prisma.permissao.create({
        data: { empresa_id: empresa.id, grupo_usuario_id: grupo.id, modulo, acao, permitido: true },
      })
    }
  }

  // Usuario admin
  const senhaHash = await bcrypt.hash('123456', 10)
  await prisma.usuario.create({
    data: {
      empresa_id: empresa.id,
      grupo_usuario_id: grupo.id,
      nome: 'Administrador',
      email: 'admin@teste.com',
      senha_hash: senhaHash,
    },
  })

  // Clientes
  const clientesData = [
    { nome: 'João Silva', cpf_cnpj: '123.456.789-00', tipo_pessoa: 'F', email: 'joao@email.com', telefone: '(11) 9999-0001' },
    { nome: 'Maria Santos', cpf_cnpj: '987.654.321-00', tipo_pessoa: 'F', email: 'maria@email.com', telefone: '(11) 9999-0002' },
    { nome: 'Tech Solutions LTDA', cpf_cnpj: '11.222.333/0001-44', tipo_pessoa: 'J', email: 'contato@techsolutions.com', telefone: '(11) 3333-0001' },
    { nome: 'Pedro Oliveira', cpf_cnpj: '111.222.333-44', tipo_pessoa: 'F', email: 'pedro@email.com', telefone: '(11) 9999-0003' },
    { nome: 'Comercial ABC LTDA', cpf_cnpj: '55.666.777/0001-88', tipo_pessoa: 'J', email: 'abc@comercial.com', telefone: '(11) 3333-0002' },
  ]
  for (const c of clientesData) {
    await prisma.cliente.create({ data: { empresa_id: empresa.id, ...c } })
  }

  // Fornecedores
  const fornecedoresData = [
    { razao_social: 'Distribuidora Nacional LTDA', nome_fantasia: 'DistriNac', cnpj: '22.333.444/0001-55', email: 'vendas@distrinac.com', telefone: '(11) 4444-0001' },
    { razao_social: 'Industria ABC S.A.', nome_fantasia: 'ABC', cnpj: '33.444.555/0001-66', email: 'compras@abc.com', telefone: '(11) 4444-0002' },
    { razao_social: 'Importadora Global LTDA', nome_fantasia: 'Global', cnpj: '44.555.666/0001-77', email: 'global@imp.com', telefone: '(11) 4444-0003' },
  ]
  for (const f of fornecedoresData) {
    await prisma.fornecedor.create({ data: { empresa_id: empresa.id, ...f } })
  }

  // Grupos de Produto
  const grupoEletronicos = await prisma.grupoProduto.create({ data: { empresa_id: empresa.id, nome: 'Eletronicos' } })
  const grupoAcessorios = await prisma.grupoProduto.create({ data: { empresa_id: empresa.id, nome: 'Acessorios' } })
  const grupoInformatica = await prisma.grupoProduto.create({ data: { empresa_id: empresa.id, nome: 'Informatica' } })

  // Unidades
  const unidadeUn = await prisma.unidade.create({ data: { empresa_id: empresa.id, nome: 'Unidade', sigla: 'UN' } })
  const unidadeKg = await prisma.unidade.create({ data: { empresa_id: empresa.id, nome: 'Quilograma', sigla: 'KG' } })
  const unidadeCx = await prisma.unidade.create({ data: { empresa_id: empresa.id, nome: 'Caixa', sigla: 'CX' } })

  // Produtos
  const produtosData = [
    { nome: 'Notebook Dell Inspiron', sku: 'NB-DELL-001', valor_venda: 4599.90, valor_custo: 3200.00, unidade_id: unidadeUn.id, grupo_id: grupoEletronicos.id },
    { nome: 'Mouse Logitech MX Master', sku: 'MS-LOG-001', valor_venda: 599.90, valor_custo: 350.00, unidade_id: unidadeUn.id, grupo_id: grupoAcessorios.id },
    { nome: 'Teclado Mecânico Redragon', sku: 'TC-RED-001', valor_venda: 299.90, valor_custo: 150.00, unidade_id: unidadeUn.id, grupo_id: grupoAcessorios.id },
    { nome: 'Monitor LG 27" 4K', sku: 'MN-LG-001', valor_venda: 2899.90, valor_custo: 1800.00, unidade_id: unidadeUn.id, grupo_id: grupoEletronicos.id },
    { nome: 'SSD Kingston 1TB', sku: 'HD-KNG-001', valor_venda: 449.90, valor_custo: 280.00, unidade_id: unidadeUn.id, grupo_id: grupoInformatica.id },
    { nome: 'Webcam Logitech C920', sku: 'WC-LOG-001', valor_venda: 399.90, valor_custo: 220.00, unidade_id: unidadeUn.id, grupo_id: grupoAcessorios.id },
    { nome: 'Cabo HDMI 2m', sku: 'CB-HDM-001', valor_venda: 39.90, valor_custo: 12.00, unidade_id: unidadeUn.id, grupo_id: grupoAcessorios.id },
    { nome: 'Memoria RAM 16GB DDR5', sku: 'MR-DDR-001', valor_venda: 499.90, valor_custo: 300.00, unidade_id: unidadeUn.id, grupo_id: grupoInformatica.id },
    { nome: 'Fonte 750W Corsair', sku: 'FT-CRS-001', valor_venda: 699.90, valor_custo: 420.00, unidade_id: unidadeUn.id, grupo_id: grupoInformatica.id },
    { nome: 'Headset HyperX Cloud', sku: 'HS-HPX-001', valor_venda: 349.90, valor_custo: 180.00, unidade_id: unidadeUn.id, grupo_id: grupoAcessorios.id },
  ]
  for (const p of produtosData) {
    const produto = await prisma.produto.create({ data: { empresa_id: empresa.id, ...p } })
    await prisma.produtoLoja.create({
      data: { empresa_id: empresa.id, produto_id: produto.id, estoque_atual: Math.floor(Math.random() * 100), estoque_minimo: 5 },
    })
  }

  // Servicos
  const servicosData = [
    { nome: 'Manutencao de computador', valor: 150.00 },
    { nome: 'Instalacao de rede', valor: 500.00 },
    { nome: 'Consultoria em TI', valor: 200.00 },
    { nome: 'Formatacao e backup', valor: 120.00 },
    { nome: 'Desenvolvimento de site', valor: 3000.00 },
  ]
  for (const s of servicosData) {
    await prisma.servico.create({ data: { empresa_id: empresa.id, ...s } })
  }

  // Formas de pagamento
  const formasData = [
    { nome: 'Dinheiro', tipo: 'dinheiro' },
    { nome: 'PIX', tipo: 'pix' },
    { nome: 'Cartao de Credito', tipo: 'cartao_credito' },
    { nome: 'Cartao de Debito', tipo: 'cartao_debito' },
    { nome: 'Boleto', tipo: 'boleto' },
  ]
  for (const f of formasData) {
    await prisma.formaPagamento.create({ data: { empresa_id: empresa.id, ...f } })
  }

  // Categorias financeiras
  const catReceitas = await prisma.categoriaFinanceira.create({ data: { empresa_id: empresa.id, nome: 'Receitas', tipo: 'receita' } })
  await prisma.categoriaFinanceira.create({ data: { empresa_id: empresa.id, nome: 'Vendas de Produtos', tipo: 'receita', pai_id: catReceitas.id } })
  await prisma.categoriaFinanceira.create({ data: { empresa_id: empresa.id, nome: 'Vendas de Servicos', tipo: 'receita', pai_id: catReceitas.id } })

  const catDespesas = await prisma.categoriaFinanceira.create({ data: { empresa_id: empresa.id, nome: 'Despesas', tipo: 'despesa' } })
  await prisma.categoriaFinanceira.create({ data: { empresa_id: empresa.id, nome: 'Salarios', tipo: 'despesa', pai_id: catDespesas.id } })
  await prisma.categoriaFinanceira.create({ data: { empresa_id: empresa.id, nome: 'Aluguel', tipo: 'despesa', pai_id: catDespesas.id } })
  await prisma.categoriaFinanceira.create({ data: { empresa_id: empresa.id, nome: 'Fornecedores', tipo: 'despesa', pai_id: catDespesas.id } })

  // Centros de custo
  await prisma.centroCusto.create({ data: { empresa_id: empresa.id, nome: 'Administrativo', descricao: 'Custos administrativos gerais' } })
  await prisma.centroCusto.create({ data: { empresa_id: empresa.id, nome: 'Comercial', descricao: 'Custos do setor comercial' } })
  await prisma.centroCusto.create({ data: { empresa_id: empresa.id, nome: 'Operacional', descricao: 'Custos operacionais' } })

  console.log('Seed concluido com sucesso!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

- [ ] **Step 3: Create database and run migration**

```bash
cd server
npx prisma migrate dev --name init
```
Expected: Migration created and applied, seed runs automatically.

- [ ] **Step 4: Run seed manually if needed**

```bash
cd server && npx prisma db seed
```

- [ ] **Step 5: Commit**

```bash
git add server/prisma/ server/.env
git commit -m "feat: add Prisma migration, seed with demo data"
```

---

## Chunk 3: Backend CRUD Modules

### Task 7: Generic CRUD service factory

**Files:**
- Create: `server/src/shared/utils/crud.ts`
- Create: `server/src/shared/utils/pagination.ts`

- [ ] **Step 1: Create pagination utility**

`server/src/shared/utils/pagination.ts`:
```typescript
import { z } from 'zod'

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  per_page: z.coerce.number().min(1).max(100).default(20),
  sort_by: z.string().optional(),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
  q: z.string().optional(),
})

export type PaginationParams = z.infer<typeof paginationSchema>

export function paginationMeta(total: number, page: number, perPage: number) {
  return {
    total,
    page,
    per_page: perPage,
    total_pages: Math.ceil(total / perPage),
  }
}
```

- [ ] **Step 2: Create generic CRUD helper**

`server/src/shared/utils/crud.ts`:
```typescript
import { PaginationParams, paginationMeta } from './pagination.js'

export function buildPaginatedQuery(params: PaginationParams, empresaId: bigint, searchFields: string[] = []) {
  const where: any = { empresa_id: empresaId, ativo: true }

  if (params.q && searchFields.length > 0) {
    where.OR = searchFields.map(field => ({
      [field]: { contains: params.q, mode: 'insensitive' },
    }))
  }

  const skip = (params.page - 1) * params.per_page
  const take = params.per_page
  const orderBy = params.sort_by
    ? { [params.sort_by]: params.sort_order }
    : { created_at: 'desc' as const }

  return { where, skip, take, orderBy }
}

export { paginationMeta }
```

- [ ] **Step 3: Commit**

```bash
git add server/src/shared/utils/crud.ts server/src/shared/utils/pagination.ts
git commit -m "feat: add pagination and generic CRUD utilities"
```

---

### Task 8: Clientes module (backend)

**Files:**
- Create: `server/src/modules/clientes/clientes.schema.ts`
- Create: `server/src/modules/clientes/clientes.service.ts`
- Create: `server/src/modules/clientes/clientes.routes.ts`
- Modify: `server/src/app.ts`

- [ ] **Step 1: Create clientes Zod schema**

`server/src/modules/clientes/clientes.schema.ts`:
```typescript
import { z } from 'zod'

export const clienteSchema = z.object({
  nome: z.string().min(1, 'Nome obrigatorio'),
  cpf_cnpj: z.string().optional().nullable(),
  tipo_pessoa: z.enum(['F', 'J']).default('F'),
  email: z.string().email('Email invalido').optional().nullable(),
  telefone: z.string().optional().nullable(),
  celular: z.string().optional().nullable(),
  observacoes: z.string().optional().nullable(),
  enderecos: z.array(z.object({
    cep: z.string().optional().nullable(),
    logradouro: z.string().optional().nullable(),
    numero: z.string().optional().nullable(),
    complemento: z.string().optional().nullable(),
    bairro: z.string().optional().nullable(),
    cidade: z.string().optional().nullable(),
    uf: z.string().max(2).optional().nullable(),
  })).optional().default([]),
  contatos: z.array(z.object({
    nome: z.string().min(1),
    telefone: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    cargo: z.string().optional().nullable(),
  })).optional().default([]),
})
```

- [ ] **Step 2: Create clientes service**

`server/src/modules/clientes/clientes.service.ts`:
```typescript
import { prisma } from '../../shared/utils/prisma.js'
import { buildPaginatedQuery, paginationMeta } from '../../shared/utils/crud.js'
import { PaginationParams } from '../../shared/utils/pagination.js'
import { z } from 'zod'
import { clienteSchema } from './clientes.schema.js'

export async function listarClientes(empresaId: bigint, params: PaginationParams) {
  const { where, skip, take, orderBy } = buildPaginatedQuery(params, empresaId, ['nome', 'cpf_cnpj', 'email'])
  const [items, total] = await Promise.all([
    prisma.cliente.findMany({ where, skip, take, orderBy, include: { enderecos: true, contatos: true } }),
    prisma.cliente.count({ where }),
  ])
  return { items: items.map(serializeCliente), ...paginationMeta(total, params.page, params.per_page) }
}

export async function buscarCliente(empresaId: bigint, id: bigint) {
  const cliente = await prisma.cliente.findFirst({
    where: { id, empresa_id: empresaId, ativo: true },
    include: { enderecos: true, contatos: true },
  })
  if (!cliente) throw { statusCode: 404, message: 'Cliente nao encontrado' }
  return serializeCliente(cliente)
}

export async function criarCliente(empresaId: bigint, data: z.infer<typeof clienteSchema>) {
  const { enderecos, contatos, ...clienteData } = data
  const cliente = await prisma.cliente.create({
    data: {
      ...clienteData,
      empresa_id: empresaId,
      enderecos: { create: enderecos.map(e => ({ ...e, empresa_id: empresaId })) },
      contatos: { create: contatos.map(c => ({ ...c, empresa_id: empresaId })) },
    },
    include: { enderecos: true, contatos: true },
  })
  return serializeCliente(cliente)
}

export async function editarCliente(empresaId: bigint, id: bigint, data: z.infer<typeof clienteSchema>) {
  const existing = await prisma.cliente.findFirst({ where: { id, empresa_id: empresaId } })
  if (!existing) throw { statusCode: 404, message: 'Cliente nao encontrado' }

  const { enderecos, contatos, ...clienteData } = data

  await prisma.clienteEndereco.deleteMany({ where: { cliente_id: id } })
  await prisma.clienteContato.deleteMany({ where: { cliente_id: id } })

  const cliente = await prisma.cliente.update({
    where: { id },
    data: {
      ...clienteData,
      enderecos: { create: enderecos.map(e => ({ ...e, empresa_id: empresaId })) },
      contatos: { create: contatos.map(c => ({ ...c, empresa_id: empresaId })) },
    },
    include: { enderecos: true, contatos: true },
  })
  return serializeCliente(cliente)
}

export async function excluirCliente(empresaId: bigint, id: bigint) {
  const existing = await prisma.cliente.findFirst({ where: { id, empresa_id: empresaId } })
  if (!existing) throw { statusCode: 404, message: 'Cliente nao encontrado' }
  await prisma.cliente.update({ where: { id }, data: { ativo: false } })
}

export async function buscaClientes(empresaId: bigint, q: string) {
  return prisma.cliente.findMany({
    where: {
      empresa_id: empresaId,
      ativo: true,
      OR: [
        { nome: { contains: q, mode: 'insensitive' } },
        { cpf_cnpj: { contains: q, mode: 'insensitive' } },
      ],
    },
    select: { id: true, nome: true, cpf_cnpj: true },
    take: 10,
  }).then(items => items.map(i => ({ id: i.id.toString(), nome: i.nome, cpf_cnpj: i.cpf_cnpj })))
}

function serializeCliente(cliente: any) {
  return {
    ...cliente,
    id: cliente.id.toString(),
    empresa_id: cliente.empresa_id.toString(),
    enderecos: cliente.enderecos?.map((e: any) => ({ ...e, id: e.id.toString(), cliente_id: e.cliente_id.toString(), empresa_id: e.empresa_id.toString() })),
    contatos: cliente.contatos?.map((c: any) => ({ ...c, id: c.id.toString(), cliente_id: c.cliente_id.toString(), empresa_id: c.empresa_id.toString() })),
  }
}
```

- [ ] **Step 3: Create clientes routes**

`server/src/modules/clientes/clientes.routes.ts`:
```typescript
import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../../shared/middleware/auth.middleware.js'
import { permissoesMiddleware } from '../../shared/middleware/permissoes.middleware.js'
import { clienteSchema } from './clientes.schema.js'
import { paginationSchema } from '../../shared/utils/pagination.js'
import * as service from './clientes.service.js'
import { success, error } from '../../shared/utils/response.js'

export async function clientesRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authMiddleware)

  app.get('/clientes/index', { preHandler: permissoesMiddleware('clientes', 'visualizar') }, async (request) => {
    const params = paginationSchema.parse(request.query)
    const data = await service.listarClientes(request.empresa_id, params)
    return success('Listagem de clientes', data)
  })

  app.get('/clientes/visualizar/:id', async (request) => {
    const { id } = request.params as { id: string }
    const data = await service.buscarCliente(request.empresa_id, BigInt(id))
    return success('Cliente encontrado', data)
  })

  app.post('/clientes/adicionar', async (request, reply) => {
    const parsed = clienteSchema.safeParse(request.body)
    if (!parsed.success) return reply.status(400).send(error(400, 'Dados invalidos', { errors: parsed.error.issues }))
    const data = await service.criarCliente(request.empresa_id, parsed.data)
    return success('Cliente cadastrado', data)
  })

  app.post('/clientes/editar/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const parsed = clienteSchema.safeParse(request.body)
    if (!parsed.success) return reply.status(400).send(error(400, 'Dados invalidos', { errors: parsed.error.issues }))
    const data = await service.editarCliente(request.empresa_id, BigInt(id), parsed.data)
    return success('Cliente atualizado', data)
  })

  app.post('/clientes/excluir/:id', async (request) => {
    const { id } = request.params as { id: string }
    await service.excluirCliente(request.empresa_id, BigInt(id))
    return success('Cliente excluido')
  })

  app.get('/clientes/buscaClientes', async (request) => {
    const { q } = request.query as { q?: string }
    const data = await service.buscaClientes(request.empresa_id, q || '')
    return success('Busca de clientes', data)
  })
}
```

- [ ] **Step 4: Register in app.ts**

```typescript
import { clientesRoutes } from './modules/clientes/clientes.routes.js'
await app.register(clientesRoutes)
```

- [ ] **Step 5: Commit**

```bash
git add server/src/modules/clientes/
git commit -m "feat: add clientes CRUD module (backend)"
```

---

### Task 9: Remaining backend CRUD modules

Follow the same pattern as Task 8 for each module. Each module has: `schema.ts`, `service.ts`, `routes.ts`. Register all in `app.ts`.

**Files to create (per module):**

- [ ] **Step 1: Fornecedores module**

`server/src/modules/fornecedores/` — same pattern as clientes but with `razao_social`, `nome_fantasia`, `cnpj`, `FornecedorEndereco[]`, `FornecedorContato[]`.

- [ ] **Step 2: Produtos module**

`server/src/modules/produtos/` — includes `valor_venda`/`valor_custo` as Decimal (use `formatMoney`/`parseMoney` for serialization), `unidade_id`, `grupo_id`, `ProdutoLoja` for estoque. Autocomplete returns `id`, `nome`, `sku`, `valor_venda`.

- [ ] **Step 3: Servicos module**

`server/src/modules/servicos/` — simple CRUD with `nome`, `valor` (Decimal), `descricao`.

- [ ] **Step 4: Formas de Pagamento module**

`server/src/modules/formas_pagamentos/` — simple CRUD with `nome`, `tipo`.

- [ ] **Step 5: Categorias Financeiras module**

`server/src/modules/categorias/` — hierarchical CRUD with `pai_id`. List returns tree structure. Use recursive include for `filhas`.

- [ ] **Step 6: Centros de Custo module**

`server/src/modules/centros_custos/` — simple CRUD with `nome`, `descricao`.

- [ ] **Step 7: Grupos de Produto module**

`server/src/modules/grupos_produtos/` — simple CRUD with `nome`. Autocomplete endpoint.

- [ ] **Step 8: Unidades module**

`server/src/modules/unidades/` — simple CRUD with `nome`, `sigla`. Autocomplete endpoint.

- [ ] **Step 9: Empresas module**

`server/src/modules/empresas/` — Read/update only (no create/delete). Endpoints:
- `GET /empresas/visualizar` — returns current empresa data (from `request.empresa_id`)
- `POST /empresas/editar` — update empresa fields (razao_social, nome_fantasia, cnpj, email, telefone)

- [ ] **Step 10: Usuarios module**

`server/src/modules/usuarios/` — full CRUD. Fields: nome, email, senha, grupo_usuario_id, ativo. Endpoints follow standard pattern. Password hashed with bcrypt on create/edit. Email must be unique. Include `buscaUsuarios` autocomplete endpoint.

- [ ] **Step 11: Dashboard module**

`server/src/modules/dashboard/` — single endpoint `GET /dashboard/resumo` that returns entity counts:
```typescript
const [total_clientes, total_fornecedores, total_produtos, total_servicos] = await Promise.all([
  prisma.cliente.count({ where: { empresa_id: empresaId, ativo: true } }),
  prisma.fornecedor.count({ where: { empresa_id: empresaId, ativo: true } }),
  prisma.produto.count({ where: { empresa_id: empresaId, ativo: true } }),
  prisma.servico.count({ where: { empresa_id: empresaId, ativo: true } }),
])
return { total_clientes, total_fornecedores, total_produtos, total_servicos, financeiro: null }
```

- [ ] **Step 10: Register all modules in app.ts**

- [ ] **Step 11: Verify all endpoints with manual testing or REST client**

- [ ] **Step 12: Commit**

```bash
git add server/src/modules/
git commit -m "feat: add all Fase 1 backend CRUD modules"
```

---

## Chunk 4: Frontend Core (Auth, Layout, Stores, Composables)

### Task 10: Frontend stores (Pinia)

**Files:**
- Create: `client/src/stores/auth.ts`
- Create: `client/src/stores/ui.ts`
- Create: `client/src/stores/menus.ts`

- [ ] **Step 1: Create auth store**

`client/src/stores/auth.ts`:
```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

interface Usuario {
  id: string
  nome: string
  email: string
}

interface Empresa {
  id: string
  razao_social: string
  nome_fantasia: string | null
}

interface Permissao {
  modulo: string
  acao: string
  permitido: boolean
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const usuario = ref<Usuario | null>(JSON.parse(localStorage.getItem('usuario') || 'null'))
  const empresa = ref<Empresa | null>(JSON.parse(localStorage.getItem('empresa') || 'null'))
  const permissoes = ref<Permissao[]>(JSON.parse(localStorage.getItem('permissoes') || '[]'))

  const isAuthenticated = computed(() => !!token.value)

  async function login(email: string, senha: string) {
    const { data: res } = await axios.post('/api/auth/login', { email, senha })
    token.value = res.data.token
    usuario.value = res.data.usuario
    empresa.value = res.data.empresa
    permissoes.value = res.data.permissoes
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('usuario', JSON.stringify(res.data.usuario))
    localStorage.setItem('empresa', JSON.stringify(res.data.empresa))
    localStorage.setItem('permissoes', JSON.stringify(res.data.permissoes))
  }

  async function logout() {
    try { await axios.post('/api/auth/logout') } catch {}
    token.value = null
    usuario.value = null
    empresa.value = null
    permissoes.value = []
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    localStorage.removeItem('empresa')
    localStorage.removeItem('permissoes')
  }

  async function refreshToken() {
    try {
      const { data: res } = await axios.post('/api/auth/refresh')
      token.value = res.data.token
      localStorage.setItem('token', res.data.token)
      return true
    } catch {
      await logout()
      return false
    }
  }

  function can(modulo: string, acao: string): boolean {
    return permissoes.value.some(p => p.modulo === modulo && p.acao === acao && p.permitido)
  }

  return { token, usuario, empresa, permissoes, isAuthenticated, login, logout, refreshToken, can }
})
```

- [ ] **Step 2: Create UI store**

`client/src/stores/ui.ts`:
```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const sidebarAberta = ref(true)
  const loadingGlobal = ref(false)

  function toggleSidebar() { sidebarAberta.value = !sidebarAberta.value }

  return { sidebarAberta, loadingGlobal, toggleSidebar }
})
```

- [ ] **Step 3: Create menus store**

`client/src/stores/menus.ts`:
```typescript
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useAuthStore } from './auth'

export const useMenusStore = defineStore('menus', () => {
  const auth = useAuthStore()

  const itens = computed(() => {
    const menu = [
      { label: 'Inicio', icon: 'pi pi-home', to: '/' },
      {
        label: 'Cadastros', icon: 'pi pi-users',
        items: [
          { label: 'Clientes', icon: 'pi pi-user', to: '/clientes', visible: auth.can('clientes', 'visualizar') },
          { label: 'Fornecedores', icon: 'pi pi-truck', to: '/fornecedores', visible: auth.can('fornecedores', 'visualizar') },
        ],
      },
      {
        label: 'Produtos', icon: 'pi pi-box',
        items: [
          { label: 'Gerenciar Produtos', icon: 'pi pi-list', to: '/produtos', visible: auth.can('produtos', 'visualizar') },
          { label: 'Servicos', icon: 'pi pi-wrench', to: '/servicos', visible: auth.can('servicos', 'visualizar') },
        ],
      },
      {
        label: 'Financeiro', icon: 'pi pi-wallet',
        items: [
          { label: 'Formas de Pagamento', icon: 'pi pi-credit-card', to: '/formas-pagamento', visible: auth.can('formas_pagamentos', 'visualizar') },
          { label: 'Plano de Contas', icon: 'pi pi-sitemap', to: '/categorias', visible: auth.can('categorias', 'visualizar') },
          { label: 'Centros de Custo', icon: 'pi pi-building', to: '/centros-custo', visible: auth.can('centros_custos', 'visualizar') },
        ],
      },
      {
        label: 'Configuracoes', icon: 'pi pi-cog',
        items: [
          { label: 'Usuarios', icon: 'pi pi-users', to: '/usuarios', visible: auth.can('usuarios', 'visualizar') },
          { label: 'Empresa', icon: 'pi pi-building', to: '/empresa' },
        ],
      },
    ]
    return menu
  })

  return { itens }
})
```

- [ ] **Step 4: Create notificacoes store**

`client/src/stores/notificacoes.ts`:
```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificacoesStore = defineStore('notificacoes', () => {
  const notificacoes = ref<any[]>([])
  const contadorNovas = ref(0)

  async function buscarNovas() {
    // Placeholder for Fase 1 — real implementation with backend endpoint in future phases
    contadorNovas.value = 0
  }

  return { notificacoes, contadorNovas, buscarNovas }
})
```

- [ ] **Step 5: Commit**

```bash
git add client/src/stores/
git commit -m "feat: add Pinia stores (auth, ui, menus, notificacoes)"
```

---

### Task 11: Axios composable with interceptors

**Files:**
- Create: `client/src/composables/useApi.ts`

- [ ] **Step 1: Create useApi composable**

`client/src/composables/useApi.ts`:
```typescript
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

let isRefreshing = false
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = []

function processQueue(error: any, token: string | null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token!)
  })
  failedQueue = []
}

api.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (err) => {
    const originalRequest = err.config
    if (err.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      const auth = useAuthStore()
      const success = await auth.refreshToken()
      isRefreshing = false

      if (success) {
        processQueue(null, auth.token)
        originalRequest.headers.Authorization = `Bearer ${auth.token}`
        return api(originalRequest)
      } else {
        processQueue(err, null)
        router.push('/login')
        return Promise.reject(err)
      }
    }
    return Promise.reject(err)
  }
)

export { api }
export function useApi() { return api }
```

- [ ] **Step 2: Create useForm composable**

`client/src/composables/useForm.ts`:
```typescript
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'

export function useForm<T>(submitFn: (data: T) => Promise<any>) {
  const loading = ref(false)
  const errors = ref<Record<string, string>>({})
  const toast = useToast()

  async function submit(data: T) {
    loading.value = true
    errors.value = {}
    try {
      const result = await submitFn(data)
      toast.add({ severity: 'success', summary: 'Sucesso', detail: result.data?.message || 'Operacao realizada', life: 3000 })
      return result
    } catch (err: any) {
      const res = err.response?.data
      if (res?.data?.errors) {
        for (const e of res.data.errors) {
          errors.value[e.path?.[0] || e.field || 'general'] = e.message
        }
      }
      toast.add({ severity: 'error', summary: 'Erro', detail: res?.message || 'Erro ao processar', life: 5000 })
      throw err
    } finally {
      loading.value = false
    }
  }

  return { loading, errors, submit }
}
```

- [ ] **Step 3: Create useAutocomplete composable**

`client/src/composables/useAutocomplete.ts`:
```typescript
import { ref } from 'vue'
import { api } from './useApi'

export function useAutocomplete(endpoint: string) {
  const items = ref<any[]>([])
  const loading = ref(false)
  let timeout: ReturnType<typeof setTimeout>

  function search(event: { query: string }) {
    clearTimeout(timeout)
    timeout = setTimeout(async () => {
      loading.value = true
      try {
        const { data: res } = await api.get(endpoint, { params: { q: event.query } })
        items.value = res.data || []
      } catch {
        items.value = []
      } finally {
        loading.value = false
      }
    }, 300)
  }

  return { items, loading, search }
}
```

- [ ] **Step 4: Create usePermissions composable**

`client/src/composables/usePermissions.ts`:
```typescript
import { useAuthStore } from '@/stores/auth'

export function usePermissions() {
  const auth = useAuthStore()
  return {
    can: (modulo: string, acao: string) => auth.can(modulo, acao),
  }
}
```

- [ ] **Step 5: Create useNotifications composable**

`client/src/composables/useNotifications.ts`:
```typescript
import { useNotificacoesStore } from '@/stores/notificacoes'

export function useNotifications() {
  const store = useNotificacoesStore()
  return {
    notificacoes: store.notificacoes,
    contadorNovas: store.contadorNovas,
    buscarNovas: store.buscarNovas,
  }
}
```

- [ ] **Step 6: Commit**

```bash
git add client/src/composables/
git commit -m "feat: add composables (useApi, useForm, useAutocomplete, usePermissions, useNotifications)"
```

---

### Task 12: Vue Router with auth guard

**Files:**
- Modify: `client/src/router/index.ts`

- [ ] **Step 1: Create router with all Fase 1 routes**

`client/src/router/index.ts`:
```typescript
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: () => import('@/layouts/AuthLayout.vue'),
      children: [
        { path: '', name: 'login', component: () => import('@/pages/auth/login.vue') },
        { path: '/recuperar-senha', name: 'recuperar-senha', component: () => import('@/pages/auth/recuperar-senha.vue') },
        { path: '/redefinir-senha', name: 'redefinir-senha', component: () => import('@/pages/auth/redefinir-senha.vue') },
      ],
      meta: { public: true },
    },
    {
      path: '/',
      component: () => import('@/layouts/DefaultLayout.vue'),
      children: [
        { path: '', name: 'dashboard', component: () => import('@/pages/dashboard/index.vue'), meta: { breadcrumb: 'Inicio' } },
        // Clientes
        { path: 'clientes', name: 'clientes', component: () => import('@/pages/clientes/index.vue'), meta: { breadcrumb: 'Clientes' } },
        { path: 'clientes/adicionar', name: 'clientes-adicionar', component: () => import('@/pages/clientes/adicionar.vue'), meta: { breadcrumb: 'Novo Cliente' } },
        { path: 'clientes/:id/visualizar', name: 'clientes-visualizar', component: () => import('@/pages/clientes/visualizar.vue'), meta: { breadcrumb: 'Visualizar Cliente' } },
        { path: 'clientes/:id/editar', name: 'clientes-editar', component: () => import('@/pages/clientes/editar.vue'), meta: { breadcrumb: 'Editar Cliente' } },
        // Fornecedores
        { path: 'fornecedores', name: 'fornecedores', component: () => import('@/pages/fornecedores/index.vue'), meta: { breadcrumb: 'Fornecedores' } },
        { path: 'fornecedores/adicionar', name: 'fornecedores-adicionar', component: () => import('@/pages/fornecedores/adicionar.vue'), meta: { breadcrumb: 'Novo Fornecedor' } },
        { path: 'fornecedores/:id/visualizar', name: 'fornecedores-visualizar', component: () => import('@/pages/fornecedores/visualizar.vue'), meta: { breadcrumb: 'Visualizar Fornecedor' } },
        { path: 'fornecedores/:id/editar', name: 'fornecedores-editar', component: () => import('@/pages/fornecedores/editar.vue'), meta: { breadcrumb: 'Editar Fornecedor' } },
        // Produtos
        { path: 'produtos', name: 'produtos', component: () => import('@/pages/produtos/index.vue'), meta: { breadcrumb: 'Produtos' } },
        { path: 'produtos/adicionar', name: 'produtos-adicionar', component: () => import('@/pages/produtos/adicionar.vue'), meta: { breadcrumb: 'Novo Produto' } },
        { path: 'produtos/:id/visualizar', name: 'produtos-visualizar', component: () => import('@/pages/produtos/visualizar.vue'), meta: { breadcrumb: 'Visualizar Produto' } },
        { path: 'produtos/:id/editar', name: 'produtos-editar', component: () => import('@/pages/produtos/editar.vue'), meta: { breadcrumb: 'Editar Produto' } },
        // Servicos
        { path: 'servicos', name: 'servicos', component: () => import('@/pages/servicos/index.vue'), meta: { breadcrumb: 'Servicos' } },
        { path: 'servicos/adicionar', name: 'servicos-adicionar', component: () => import('@/pages/servicos/adicionar.vue'), meta: { breadcrumb: 'Novo Servico' } },
        { path: 'servicos/:id/visualizar', name: 'servicos-visualizar', component: () => import('@/pages/servicos/visualizar.vue'), meta: { breadcrumb: 'Visualizar Servico' } },
        { path: 'servicos/:id/editar', name: 'servicos-editar', component: () => import('@/pages/servicos/editar.vue'), meta: { breadcrumb: 'Editar Servico' } },
        // Formas de Pagamento
        { path: 'formas-pagamento', name: 'formas-pagamento', component: () => import('@/pages/formas-pagamento/index.vue'), meta: { breadcrumb: 'Formas de Pagamento' } },
        { path: 'formas-pagamento/adicionar', name: 'formas-pagamento-adicionar', component: () => import('@/pages/formas-pagamento/adicionar.vue'), meta: { breadcrumb: 'Nova Forma' } },
        { path: 'formas-pagamento/:id/editar', name: 'formas-pagamento-editar', component: () => import('@/pages/formas-pagamento/editar.vue'), meta: { breadcrumb: 'Editar Forma' } },
        // Categorias
        { path: 'categorias', name: 'categorias', component: () => import('@/pages/categorias/index.vue'), meta: { breadcrumb: 'Plano de Contas' } },
        // Centros de Custo
        { path: 'centros-custo', name: 'centros-custo', component: () => import('@/pages/centros-custo/index.vue'), meta: { breadcrumb: 'Centros de Custo' } },
        { path: 'centros-custo/adicionar', name: 'centros-custo-adicionar', component: () => import('@/pages/centros-custo/adicionar.vue'), meta: { breadcrumb: 'Novo Centro' } },
        { path: 'centros-custo/:id/editar', name: 'centros-custo-editar', component: () => import('@/pages/centros-custo/editar.vue'), meta: { breadcrumb: 'Editar Centro' } },
        // Configuracoes
        { path: 'usuarios', name: 'usuarios', component: () => import('@/pages/usuarios/index.vue'), meta: { breadcrumb: 'Usuarios' } },
        { path: 'usuarios/adicionar', name: 'usuarios-adicionar', component: () => import('@/pages/usuarios/adicionar.vue'), meta: { breadcrumb: 'Novo Usuario' } },
        { path: 'usuarios/:id/editar', name: 'usuarios-editar', component: () => import('@/pages/usuarios/editar.vue'), meta: { breadcrumb: 'Editar Usuario' } },
        { path: 'empresa', name: 'empresa', component: () => import('@/pages/empresa/index.vue'), meta: { breadcrumb: 'Empresa' } },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!to.meta.public && !auth.isAuthenticated) {
    return { name: 'login' }
  }
})

export default router
```

- [ ] **Step 2: Commit**

```bash
git add client/src/router/
git commit -m "feat: add Vue Router with auth guard and all Fase 1 routes"
```

---

### Task 13: Layouts (Default + Auth)

**Files:**
- Create: `client/src/layouts/DefaultLayout.vue`
- Create: `client/src/layouts/AuthLayout.vue`
- Create: `client/src/components/common/AppHeader.vue`
- Create: `client/src/components/common/AppSidebar.vue`
- Create: `client/src/components/common/AppBreadcrumb.vue`

- [ ] **Step 1: Create AppHeader**

`client/src/components/common/AppHeader.vue`:
PrimeVue Toolbar with logo, hamburger button (calls `uiStore.toggleSidebar()`), notification badge (placeholder), and user avatar dropdown with "Sair" option calling `authStore.logout()` then `router.push('/login')`.

- [ ] **Step 2: Create AppSidebar**

`client/src/components/common/AppSidebar.vue`:
PrimeVue PanelMenu using `menusStore.itens`. Hidden when `!uiStore.sidebarAberta`. Uses `router-link` for navigation via `to` property.

- [ ] **Step 3: Create AppBreadcrumb**

`client/src/components/common/AppBreadcrumb.vue`:
PrimeVue Breadcrumb. Items built from `route.matched` using `meta.breadcrumb`. Home item links to `/`.

- [ ] **Step 4: Create DefaultLayout**

`client/src/layouts/DefaultLayout.vue`:
```vue
<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <div class="flex flex-1">
      <AppSidebar />
      <main class="flex-1 p-6 bg-gray-50">
        <AppBreadcrumb />
        <RouterView />
      </main>
    </div>
  </div>
  <Toast />
  <ConfirmDialog />
</template>
```

- [ ] **Step 5: Create AuthLayout**

`client/src/layouts/AuthLayout.vue`:
```vue
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md">
      <RouterView />
    </div>
  </div>
</template>
```

- [ ] **Step 6: Commit**

```bash
git add client/src/layouts/ client/src/components/common/
git commit -m "feat: add DefaultLayout, AuthLayout, AppHeader, AppSidebar, AppBreadcrumb"
```

---

### Task 14: Login page

**Files:**
- Create: `client/src/pages/auth/login.vue`
- Create: `client/src/pages/auth/recuperar-senha.vue`

- [ ] **Step 1: Create login page**

`client/src/pages/auth/login.vue`:
PrimeVue Card centered. Form with InputText for email, Password for senha, Button "Entrar". Uses `authStore.login()` on submit. Shows Toast on error. Redirects to `/` on success. Link to "Esqueci minha senha".

- [ ] **Step 2: Create recuperar-senha page**

`client/src/pages/auth/recuperar-senha.vue`:
Simple form with email input, Button "Enviar". Calls `POST /api/auth/recuperar-senha`. Shows success message. Link back to login.

- [ ] **Step 3: Create redefinir-senha page**

`client/src/pages/auth/redefinir-senha.vue`:
Form with Password input (nova_senha), Password input (confirmar_senha), Button "Redefinir". Reads `token` from URL query params. Calls `POST /api/auth/redefinir-senha { token, nova_senha }`. Shows Toast on success, links back to login.

- [ ] **Step 4: Verify login flow end-to-end**

Start both server and client. Navigate to `/login`. Login with `admin@teste.com` / `123456`. Should redirect to dashboard. Verify token in localStorage.

- [ ] **Step 4: Commit**

```bash
git add client/src/pages/auth/
git commit -m "feat: add login and recuperar-senha pages"
```

---

## Chunk 5: Frontend Reusable Components

### Task 15: Common components

**Files:**
- Create: `client/src/components/common/MoneyInput.vue`
- Create: `client/src/components/common/DateInput.vue`
- Create: `client/src/components/common/FormAutocomplete.vue`
- Create: `client/src/components/common/StatusBadge.vue`
- Create: `client/src/components/common/ConfirmDialog.vue`

- [ ] **Step 1: Create MoneyInput**

`client/src/components/common/MoneyInput.vue`:
Input with Brazilian money mask. Uses `toLocaleString('pt-BR')` for display. Emits formatted string `"1.500,00"` via `v-model`. PrimeVue InputText as base.

- [ ] **Step 2: Create DateInput**

PrimeVue DatePicker with `dateFormat="dd/mm/yy"`. Emits/receives Date object internally, displays as DD/MM/YYYY.

- [ ] **Step 3: Create FormAutocomplete**

PrimeVue AutoComplete wrapper. Props: `endpoint` (string), `placeholder`, `modelValue`. On input change (debounce 300ms), calls `GET /api/{endpoint}?q=text`. Displays dropdown. Emits `{ id, nome }` on select.

- [ ] **Step 4: Create StatusBadge**

PrimeVue Tag/Badge. Props: `status`, `modulo`. Maps status to severity: ativo→success, inativo→danger, aberto→warning, etc.

- [ ] **Step 5: Create DataTable wrapper**

`client/src/components/common/DataTable.vue`:
PrimeVue DataTable wrapper. Props: `columns` (array of { field, header, sortable? }), `service` (object with `listar` method), `searchFields` (string[]), `routePrefix` (string for row action links). Features:
- Auto-calls `service.listar({ page, per_page, q, sort_by, sort_order })` on mount and pagination/sort change
- Search InputText with 500ms debounce
- Slot `#actions` for custom row action buttons, with default: visualizar (eye), editar (pencil), excluir (trash with confirm)
- Emits: `@delete` (calls service.excluir then refreshes)

- [ ] **Step 6: Create FileUpload**

`client/src/components/common/FileUpload.vue`:
PrimeVue FileUpload wrapper. Props: `accept` (file types), `maxFileSize`, `modelValue`. Emits File object on upload. Shows preview for images.

- [ ] **Step 7: ConfirmDialog (already provided by PrimeVue)**

Just import and use `useConfirm()` from PrimeVue in pages. No custom wrapper needed — PrimeVue ConfirmDialog already registered in main.ts.

- [ ] **Step 8: Commit**

```bash
git add client/src/components/common/
git commit -m "feat: add MoneyInput, DateInput, FormAutocomplete, StatusBadge, DataTable, FileUpload components"
```

---

### Task 16: Frontend services

**Files:**
- Create: `client/src/services/authService.ts`
- Create: `client/src/services/clientesService.ts`
- Create: `client/src/services/fornecedoresService.ts`
- Create: `client/src/services/produtosService.ts`
- Create: `client/src/services/servicosService.ts`
- Create: `client/src/services/formasPagamentoService.ts`
- Create: `client/src/services/categoriasService.ts`
- Create: `client/src/services/centrosCustoService.ts`
- Create: `client/src/services/dashboardService.ts`

- [ ] **Step 1: Create service factory pattern**

Each service follows the same pattern:
```typescript
import { api } from '@/composables/useApi'

const BASE = '/clientes'

export const clientesService = {
  listar: (params?: Record<string, any>) => api.get(`${BASE}/index`, { params }),
  buscar: (id: string) => api.get(`${BASE}/visualizar/${id}`),
  criar: (data: any) => api.post(`${BASE}/adicionar`, data),
  editar: (id: string, data: any) => api.post(`${BASE}/editar/${id}`, data),
  excluir: (id: string) => api.post(`${BASE}/excluir/${id}`),
  autocomplete: (q: string) => api.get(`${BASE}/buscaClientes`, { params: { q } }),
}
```

- [ ] **Step 2: Create all services following the pattern**

Repeat for fornecedores, produtos, servicos, formasPagamento, categorias, centrosCusto, dashboard.

- [ ] **Step 3: Commit**

```bash
git add client/src/services/
git commit -m "feat: add all frontend API services"
```

---

## Chunk 6: Frontend CRUD Pages

### Task 17: Clientes pages (template for all CRUDs)

**Files:**
- Create: `client/src/pages/clientes/index.vue`
- Create: `client/src/pages/clientes/adicionar.vue`
- Create: `client/src/pages/clientes/visualizar.vue`
- Create: `client/src/pages/clientes/editar.vue`

- [ ] **Step 1: Create clientes listing (index.vue)**

PrimeVue DataTable with:
- Columns: nome, cpf_cnpj, email, telefone, tipo_pessoa
- Server-side pagination via `clientesService.listar({ page, per_page, q })`
- Search input (InputText) with debounce
- "Novo Cliente" button linking to `/clientes/adicionar`
- Row actions: "Visualizar" (eye icon), "Editar" (pencil), "Excluir" (trash with confirm)

- [ ] **Step 2: Create clientes form (adicionar.vue)**

Form with:
- InputText: nome (required), cpf_cnpj, email, telefone, celular
- Dropdown: tipo_pessoa (F/J)
- Textarea: observacoes
- Dynamic section "Enderecos" — add/remove address rows (cep, logradouro, numero, complemento, bairro, cidade, uf)
- Dynamic section "Contatos" — add/remove contact rows (nome, telefone, email, cargo)
- VeeValidate + Zod for validation
- Submit calls `clientesService.criar(data)`, shows Toast, redirects to listing

- [ ] **Step 3: Create clientes visualizar page**

Read-only display of all cliente fields + enderecos + contatos. Buttons: "Editar", "Voltar".

- [ ] **Step 4: Create clientes editar page**

Same form as adicionar, pre-populated with data from `clientesService.buscar(id)`. Submit calls `clientesService.editar(id, data)`.

- [ ] **Step 5: Verify end-to-end CRUD flow for clientes**

Login → navigate to Clientes → add new → view → edit → soft delete. All should work.

- [ ] **Step 6: Commit**

```bash
git add client/src/pages/clientes/
git commit -m "feat: add clientes CRUD pages (frontend)"
```

---

### Task 18: Fornecedores pages

Same pattern as clientes but with: razao_social, nome_fantasia, cnpj, email, telefone, observacoes, FornecedorEndereco[], FornecedorContato[].

- [ ] **Step 1: Create index.vue, adicionar.vue, visualizar.vue, editar.vue**
- [ ] **Step 2: Verify CRUD flow**
- [ ] **Step 3: Commit**

```bash
git add client/src/pages/fornecedores/
git commit -m "feat: add fornecedores CRUD pages (frontend)"
```

---

### Task 19: Produtos pages

- [ ] **Step 1: Create listing with columns: nome, sku, valor_venda, grupo, unidade, estoque**

Use `formatMoney` helper for displaying valor_venda.

- [ ] **Step 2: Create form with MoneyInput for valor_venda/valor_custo, FormAutocomplete for unidade/grupo**

Include "Gerenciar Grupos" and "Gerenciar Unidades" buttons that open PrimeVue Dialog with simple CRUD list inside.

- [ ] **Step 3: Create visualizar and editar pages**
- [ ] **Step 4: Commit**

```bash
git add client/src/pages/produtos/
git commit -m "feat: add produtos CRUD pages with grupo/unidade management"
```

---

### Task 20: Servicos pages

Simple CRUD: nome, valor (MoneyInput), descricao, ativo.

- [ ] **Step 1: Create index.vue, adicionar.vue, visualizar.vue, editar.vue**
- [ ] **Step 2: Commit**

```bash
git add client/src/pages/servicos/
git commit -m "feat: add servicos CRUD pages (frontend)"
```

---

### Task 21: Formas de Pagamento pages

Simple CRUD: nome, tipo (Dropdown with options: dinheiro, pix, cartao_credito, cartao_debito, boleto, cheque, outros).

- [ ] **Step 1: Create index.vue, adicionar.vue, visualizar.vue, editar.vue**
- [ ] **Step 2: Commit**

```bash
git add client/src/pages/formas-pagamento/
git commit -m "feat: add formas de pagamento CRUD pages (frontend)"
```

---

### Task 22: Categorias Financeiras (Plano de Contas) page

Single page with PrimeVue TreeTable showing hierarchical categories. Inline add/edit via Dialog.

- [ ] **Step 1: Create index.vue with TreeTable**

Display tree: Receitas → subcategories, Despesas → subcategories. Buttons per row: add child, edit, delete. Dialog for add/edit with: nome, tipo (receita/despesa), pai_id (dropdown of existing categories).

- [ ] **Step 2: Commit**

```bash
git add client/src/pages/categorias/
git commit -m "feat: add categorias financeiras page with TreeTable"
```

---

### Task 23: Centros de Custo pages

Simple CRUD: nome, descricao.

- [ ] **Step 1: Create index.vue, adicionar.vue, editar.vue**
- [ ] **Step 2: Commit**

```bash
git add client/src/pages/centros-custo/
git commit -m "feat: add centros de custo CRUD pages (frontend)"
```

---

### Task 24: Usuarios pages

**Files:**
- Create: `client/src/pages/usuarios/index.vue`
- Create: `client/src/pages/usuarios/adicionar.vue`
- Create: `client/src/pages/usuarios/editar.vue`

- [ ] **Step 1: Create usuarios listing**

DataTable with columns: nome, email, grupo (from grupo_usuario.nome), ativo (StatusBadge).

- [ ] **Step 2: Create usuarios form (adicionar/editar)**

Form: nome (InputText), email (InputText), senha (Password, required on add, optional on edit), grupo_usuario_id (Dropdown populated from API), ativo (Checkbox).

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/usuarios/
git commit -m "feat: add usuarios management pages"
```

---

### Task 25: Empresa settings page

**Files:**
- Create: `client/src/pages/empresa/index.vue`

- [ ] **Step 1: Create empresa page**

Single page with form pre-filled from `GET /api/empresas/visualizar`. Editable fields: razao_social, nome_fantasia, cnpj (read-only), email, telefone. Save button calls `POST /api/empresas/editar`.

- [ ] **Step 2: Commit**

```bash
git add client/src/pages/empresa/
git commit -m "feat: add empresa settings page"
```

---

## Chunk 7: Dashboard + Final Integration

### Task 26: Dashboard page

**Files:**
- Create: `client/src/pages/dashboard/index.vue`

- [ ] **Step 1: Create dashboard page**

Layout:
- 4 summary cards at top using PrimeVue Card: "Total Clientes", "Total Fornecedores", "Total Produtos", "Total Servicos" — each showing the count from `GET /api/dashboard/resumo`.
- Placeholder section: "Graficos financeiros disponiveis na Fase 3" with PrimeVue Message info.
- Recent data section (optional): latest 5 clientes and 5 produtos as small tables.

- [ ] **Step 2: Verify dashboard loads with real data from seed**

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/dashboard/
git commit -m "feat: add dashboard page with entity counts"
```

---

### Task 27: Final integration and smoke test

- [ ] **Step 1: Verify full app flow**

1. Start server: `cd server && npm run dev`
2. Start client: `cd client && npm run dev`
3. Navigate to `http://localhost:5173`
4. Should redirect to `/login`
5. Login with `admin@teste.com` / `123456`
6. Dashboard shows entity counts
7. Navigate to each CRUD module, verify listing/add/edit/delete
8. Logout works

- [ ] **Step 2: Fix any integration issues**

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete ERP Fase 1 MVP — auth, layout, dashboard, all CRUD modules"
```
