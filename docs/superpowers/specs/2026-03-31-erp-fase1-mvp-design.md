# ERP Empresarial — Fase 1 (MVP) Design Spec
**Data:** 2026-03-31
**Escopo:** Frontend + Backend da Fase 1 (Core MVP)

---

## 1. Visao Geral

ERP SaaS multi-tenant para gestao empresarial. A Fase 1 entrega: autenticacao, layout base, dashboard, e CRUDs de cadastros fundamentais (clientes, fornecedores, produtos, servicos, formas de pagamento, plano de contas, centros de custo).

---

## 2. Stack Tecnologica

### Frontend
| Tecnologia | Versao/Lib |
|-----------|-----------|
| Framework | Vue 3 + Composition API |
| Bundler | Vite |
| Linguagem | TypeScript |
| UI Components | PrimeVue |
| CSS | Tailwind CSS |
| State | Pinia |
| Router | Vue Router 4 |
| HTTP | Axios |
| Validacao | VeeValidate + Zod |
| Graficos | Chart.js (via PrimeVue Chart) |

### Backend
| Tecnologia | Versao/Lib |
|-----------|-----------|
| Runtime | Node.js 22 LTS |
| Framework | Fastify 5 |
| Linguagem | TypeScript |
| ORM | Prisma 6 |
| Banco | PostgreSQL 16 |
| Auth | JWT + Refresh Token |

### Tema
- Light mode apenas

---

## 3. Estrutura do Projeto

```
ERP_empresarial/
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   └── common/
│   │   │       ├── AppHeader.vue
│   │   │       ├── AppSidebar.vue
│   │   │       ├── AppBreadcrumb.vue
│   │   │       ├── DataTable.vue
│   │   │       ├── FormAutocomplete.vue
│   │   │       ├── MoneyInput.vue
│   │   │       ├── DateInput.vue
│   │   │       ├── StatusBadge.vue
│   │   │       ├── ConfirmDialog.vue
│   │   │       └── FileUpload.vue
│   │   ├── composables/
│   │   │   ├── useApi.ts
│   │   │   ├── useForm.ts
│   │   │   ├── useAutocomplete.ts
│   │   │   ├── useNotifications.ts
│   │   │   └── usePermissions.ts
│   │   ├── layouts/
│   │   │   ├── DefaultLayout.vue
│   │   │   └── AuthLayout.vue
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── login.vue
│   │   │   │   ├── recuperar-senha.vue
│   │   │   │   └── redefinir-senha.vue
│   │   │   ├── dashboard/
│   │   │   │   └── index.vue
│   │   │   ├── clientes/
│   │   │   │   ├── index.vue
│   │   │   │   ├── adicionar.vue
│   │   │   │   └── [id]/
│   │   │   │       ├── visualizar.vue
│   │   │   │       └── editar.vue
│   │   │   ├── fornecedores/
│   │   │   ├── produtos/
│   │   │   ├── servicos/
│   │   │   ├── formas-pagamento/
│   │   │   ├── categorias/
│   │   │   └── centros-custo/
│   │   ├── router/
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   ├── authService.ts
│   │   │   ├── dashboardService.ts
│   │   │   ├── clientesService.ts
│   │   │   ├── fornecedoresService.ts
│   │   │   ├── produtosService.ts
│   │   │   ├── servicosService.ts
│   │   │   ├── formasPagamentoService.ts
│   │   │   ├── categoriasService.ts
│   │   │   └── centrosCustoService.ts
│   │   ├── stores/
│   │   │   ├── auth.ts
│   │   │   ├── ui.ts
│   │   │   ├── notificacoes.ts
│   │   │   └── menus.ts
│   │   ├── App.vue
│   │   └── main.ts
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
├── server/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── auth.schema.ts
│   │   │   ├── dashboard/
│   │   │   ├── clientes/
│   │   │   ├── fornecedores/
│   │   │   ├── produtos/
│   │   │   ├── servicos/
│   │   │   ├── formas_pagamentos/
│   │   │   ├── categorias/
│   │   │   ├── centros_custos/
│   │   │   ├── empresas/
│   │   │   └── usuarios/
│   │   ├── shared/
│   │   │   ├── middleware/
│   │   │   │   ├── auth.middleware.ts
│   │   │   │   ├── tenant.middleware.ts
│   │   │   │   └── permissoes.middleware.ts
│   │   │   ├── utils/
│   │   │   │   ├── money.ts
│   │   │   │   ├── date.ts
│   │   │   │   └── response.ts
│   │   │   └── types/
│   │   │       └── fastify.d.ts
│   │   └── app.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── tsconfig.json
│   └── package.json
└── package.json
```

---

## 4. Layout e Navegacao

### DefaultLayout
- **Header (topbar fixa):** Logo, botao hamburger (toggle sidebar), icone notificacoes com badge, dropdown avatar (perfil, sair)
- **Sidebar:** PrimeVue PanelMenu, colapsavel. Itens filtrados por permissao do usuario.
- **Breadcrumb:** PrimeVue Breadcrumb, gerado via route meta.
- **Area de conteudo:** Slot principal onde cada pagina renderiza.

### AuthLayout
- Tela centralizada, sem sidebar/header. Usado para login e recuperacao de senha.

### Menu da Sidebar (Fase 1)
```
Inicio (Dashboard)
Cadastros
├── Clientes
├── Fornecedores
Produtos
├── Gerenciar Produtos
├── Servicos
Financeiro
├── Formas de Pagamento
├── Plano de Contas
├── Centros de Custo
Configuracoes
├── Usuarios
├── Empresa
```

### Rotas
Todas protegidas via `router.beforeEach` — redireciona para `/login` se nao autenticado. Lazy loading por modulo via `() => import(...)`.

---

## 5. Autenticacao e Multi-tenant

### Fluxo de Login
1. Tela de login (email + senha) → `POST /auth/login`
2. API retorna `{ token, refreshToken, usuario, empresa }`
3. Token armazenado no Pinia (authStore) + localStorage
4. Axios interceptor injeta `Authorization: Bearer <token>` em toda request
5. Interceptor de resposta: se 401 → limpa store → redireciona /login

### Multi-tenant
- Row-level isolation: todas as tabelas tem `empresa_id`
- `empresa_id` extraido do JWT no backend
- Middleware Fastify injeta `empresa_id` em `request.empresa_id`
- Todas as queries Prisma filtram por `empresa_id`

### Recuperacao de Senha
1. `POST /auth/recuperar-senha` → envia email com token (expira em 1h)
2. `POST /auth/redefinir-senha` → valida token, atualiza senha

### Refresh Token
- Refresh token armazenado em httpOnly cookie (nao acessivel via JS)
- Endpoint `POST /auth/refresh` → recebe cookie, retorna novo access token
- Access token: expira em 15 minutos
- Refresh token: expira em 7 dias, com rotacao (novo refresh token a cada uso)
- Axios interceptor: ao receber 401, tenta `POST /auth/refresh` silenciosamente. Se falhar, limpa store e redireciona para /login

### Pinia Stores
- **authStore:** token, refreshToken, usuario, empresa, login(), logout(), isAuthenticated
- **uiStore:** sidebarAberta, loadingGlobal
- **notificacoesStore:** notificacoes[], contadorNovas, buscarNovas()
- **menusStore:** itens[] (dinamico por permissao)

---

## 6. Modulos CRUD

### Padrao de Listagem (index.vue)
- PrimeVue DataTable com paginacao server-side
- Filtros: busca texto, periodo (data), status
- Colunas configuraveis por modulo
- Acoes por linha: visualizar, editar, excluir
- Botao "Novo" no topo

### Padrao de Formulario (adicionar.vue / editar.vue)
- VeeValidate + Zod para validacao
- Componentes reutilizaveis: FormAutocomplete, MoneyInput, DateInput
- Loading state no submit
- PrimeVue Toast para sucesso/erro

### Padrao de Visualizacao ([id]/visualizar.vue)
- Dados em modo leitura
- Botoes: editar, excluir, voltar

### Service Pattern
Cada modulo tem um service com metodos padrao:
```ts
listar(params)     → GET /{modulo}/index
buscar(id)         → GET /{modulo}/visualizar/{id}
criar(data)        → POST /{modulo}/adicionar
editar(id, data)   → POST /{modulo}/editar/{id}
excluir(id)        → POST /{modulo}/excluir/{id}
autocomplete(q)    → GET /{modulo}/busca{Modulo}?q=
```

### Modulos e Campos

**Clientes:**
- Campos: nome, cpf_cnpj, tipo_pessoa (F/J), email, telefone, celular, observacoes
- Relacoes: ClienteEndereco[] (cep, logradouro, numero, bairro, cidade, uf), ClienteContato[] (nome, telefone, email, cargo)

**Fornecedores:**
- Campos: razao_social, nome_fantasia, cnpj, email, telefone, observacoes
- Relacoes: FornecedorEndereco[], FornecedorContato[]

**Produtos:**
- Campos: nome, sku, valor_venda, valor_custo, unidade_id, grupo_id, descricao, ativo
- Relacoes: ProdutoLoja (estoque_atual, estoque_minimo por loja)

**Servicos:**
- Campos: nome, valor, descricao, ativo

**Formas de Pagamento:**
- Campos: nome, tipo (dinheiro/cartao_credito/cartao_debito/boleto/pix/cheque/outros), ativo

**Categorias Financeiras (Plano de Contas):**
- Campos: nome, tipo (receita/despesa), pai_id (hierarquico), ativo
- Exibido como TreeTable do PrimeVue

**Centros de Custo:**
- Campos: nome, descricao, ativo

**Grupos de Produto:** (lookup, gerenciado dentro do modulo Produtos)
- Campos: nome
- CRUD simples acessivel via botao "Gerenciar grupos" na tela de produtos

**Unidades:** (lookup, gerenciado dentro do modulo Produtos)
- Campos: nome, sigla (ex: "Unidade" / "UN", "Quilograma" / "KG")
- CRUD simples acessivel via botao "Gerenciar unidades" na tela de produtos

---

## 7. Dashboard

**URL:** `/inicio`

**Cards resumo (topo):**
- A receber hoje (verde)
- A pagar hoje (laranja)
- Recebimentos do mes (azul)
- Pagamentos do mes (azul)

**Graficos:**
- Fluxo de caixa — grafico de linha temporal (Chart.js via PrimeVue Chart)
- Vendas do mes — grafico de barras
- Contas bancarias — barras horizontais

**Endpoint:** `GET /dashboard/resumo`

Na Fase 1 (sem modulo financeiro), o dashboard exibe contadores reais de entidades cadastradas:
```json
{
  "total_clientes": 15,
  "total_fornecedores": 8,
  "total_produtos": 42,
  "total_servicos": 10,
  "financeiro": null
}
```
Os cards financeiros e graficos de fluxo de caixa ficam com placeholder "Disponivel na Fase 3". A logica real de calculo vem com o modulo Financeiro.

---

## 8. Componentes Reutilizaveis

### FormAutocomplete.vue
- Props: `endpoint`, `placeholder`, `modelValue`
- Debounce 300ms no input
- Chama `GET /{endpoint}?q=texto`
- Dropdown com resultados
- Ao selecionar: emite `{ id, nome }` para o parent
- Usa PrimeVue AutoComplete como base

### MoneyInput.vue
- Mascara BR: `1.500,00`
- Armazena internamente como string com virgula (compativel com API)
- Props: `modelValue`, `label`

### DateInput.vue
- PrimeVue Calendar com formato `DD/MM/YYYY`
- Armazena como string `DD/MM/YYYY`

### DataTable.vue (wrapper)
- Props: `columns`, `service`, `filters`
- Paginacao server-side automatica
- Slot para acoes customizadas por linha
- Botoes padrao: visualizar, editar, excluir

### StatusBadge.vue
- Props: `status`, `modulo`
- Mapa de cores por status (verde=ativo, vermelho=cancelado, amarelo=aberto, etc.)

### ConfirmDialog.vue
- PrimeVue ConfirmDialog para acoes destrutivas (excluir)

---

## 9. Backend — Modulos e Middleware

### Middleware Chain (toda request autenticada)
1. `authMiddleware` — valida JWT, extrai `usuario_id`
2. `tenantMiddleware` — extrai `empresa_id` do token, injeta no request
3. `permissoesMiddleware` — verifica permissao da rota para o grupo do usuario

### Modulos
Cada modulo segue o padrao: `{modulo}.routes.ts`, `{modulo}.service.ts`, `{modulo}.schema.ts`

Modulos da Fase 1:
- auth, dashboard, clientes, fornecedores, produtos, servicos, formas_pagamentos, categorias, centros_custos, empresas, usuarios

### Padrao de Resposta
```json
{ "code": 200, "status": "success", "message": "...", "data": {...} }
{ "code": 422, "status": "error", "message": "...", "data": [] }
```

### Convencoes
- IDs: strings numericas (serializados como string no JSON, BigInt no banco)
- Valores monetarios: `Decimal(18,2)` no banco, formatados como `"1.500,00"` na API/frontend via utils/money.ts
- Datas: `DateTime` no banco, serializadas como ISO 8601 na API, formatadas como `DD/MM/YYYY` no frontend
- Booleanos: `Boolean` nativo no Prisma/PostgreSQL

### Tratamento de Erros
| HTTP Status | Uso | Formato |
|-------------|-----|---------|
| 200 | Sucesso | `{ code: 200, status: "success", message: "...", data: {...} }` |
| 400 | Validacao (Zod) | `{ code: 400, status: "error", message: "Dados invalidos", data: { errors: [{ field, message }] } }` |
| 401 | Nao autenticado | `{ code: 401, status: "error", message: "Token invalido" }` |
| 403 | Sem permissao | `{ code: 403, status: "error", message: "Sem permissao" }` |
| 404 | Nao encontrado | `{ code: 404, status: "error", message: "Registro nao encontrado" }` |
| 409 | Conflito (duplicado) | `{ code: 409, status: "error", message: "CNPJ ja cadastrado" }` |
| 500 | Erro interno | `{ code: 500, status: "error", message: "Erro interno" }` |

### Paginacao
Query params padrao: `page` (default 1), `per_page` (default 20), `sort_by`, `sort_order` (asc/desc), `q` (busca)
```json
{
  "code": 200,
  "status": "success",
  "data": { "items": [...], "total": 150, "page": 1, "per_page": 20, "total_pages": 8 }
}
```

### CORS
Fastify CORS plugin habilitado em dev para aceitar requests do Vite dev server (porta diferente). Em producao, configurado para o dominio do frontend.

### Soft Delete
Convencao global: `excluir` faz soft delete (`ativo = false`). Listagens filtram `ativo = true` por padrao. Hard delete apenas via admin/migration.

### Justificativa POST para editar/excluir
Segue o padrao da API do GestaoClick para manter compatibilidade conceitual. Tradeoff aceito: perde semantica HTTP padrao, mas mantem consistencia com a referencia.

---

## 10. Prisma Schema (Entidades Fase 1)

```prisma
model Empresa {
  id               BigInt    @id @default(autoincrement())
  razao_social     String
  nome_fantasia    String?
  cnpj             String    @unique
  email            String?
  telefone         String?
  created_at       DateTime  @default(now())
  updated_at       DateTime  @updatedAt

  usuarios         Usuario[]
  grupos_usuarios  GrupoUsuario[]
  clientes         Cliente[]
  fornecedores     Fornecedor[]
  produtos         Produto[]
  servicos         Servico[]
  formas_pagamento FormaPagamento[]
  categorias       CategoriaFinanceira[]
  centros_custo    CentroCusto[]
  grupos_produto   GrupoProduto[]
  unidades         Unidade[]
}

model Usuario {
  id               BigInt    @id @default(autoincrement())
  empresa_id       BigInt
  grupo_usuario_id BigInt?
  nome             String
  email            String    @unique
  senha_hash       String
  ativo            Boolean   @default(true)
  created_at       DateTime  @default(now())
  updated_at       DateTime  @updatedAt

  empresa          Empresa        @relation(fields: [empresa_id], references: [id])
  grupo_usuario    GrupoUsuario?  @relation(fields: [grupo_usuario_id], references: [id])
}

model GrupoUsuario {
  id               BigInt    @id @default(autoincrement())
  empresa_id       BigInt
  nome             String
  created_at       DateTime  @default(now())

  empresa          Empresa      @relation(fields: [empresa_id], references: [id])
  permissoes       Permissao[]
  usuarios         Usuario[]
}

model Permissao {
  id                BigInt    @id @default(autoincrement())
  empresa_id        BigInt
  grupo_usuario_id  BigInt
  modulo            String
  acao              String
  permitido         Boolean   @default(true)

  empresa           Empresa       @relation(fields: [empresa_id], references: [id])
  grupo_usuario     GrupoUsuario  @relation(fields: [grupo_usuario_id], references: [id])

  @@index([empresa_id])
  @@index([grupo_usuario_id])
}

model Cliente {
  id               BigInt    @id @default(autoincrement())
  empresa_id       BigInt
  nome             String
  cpf_cnpj         String?
  tipo_pessoa      String    @default("F")
  email            String?
  telefone         String?
  celular          String?
  observacoes      String?
  ativo            Boolean   @default(true)
  created_at       DateTime  @default(now())
  updated_at       DateTime  @updatedAt

  empresa          Empresa            @relation(fields: [empresa_id], references: [id])
  enderecos        ClienteEndereco[]
  contatos         ClienteContato[]

  @@index([empresa_id])
}

model ClienteEndereco {
  id               BigInt    @id @default(autoincrement())
  empresa_id       BigInt
  cliente_id       BigInt
  cep              String?
  logradouro       String?
  numero           String?
  complemento      String?
  bairro           String?
  cidade           String?
  uf               String?

  cliente          Cliente   @relation(fields: [cliente_id], references: [id], onDelete: Cascade)

  @@index([empresa_id])
}

model ClienteContato {
  id               BigInt    @id @default(autoincrement())
  empresa_id       BigInt
  cliente_id       BigInt
  nome             String
  telefone         String?
  email            String?
  cargo            String?

  cliente          Cliente   @relation(fields: [cliente_id], references: [id], onDelete: Cascade)

  @@index([empresa_id])
}

model Fornecedor {
  id               BigInt    @id @default(autoincrement())
  empresa_id       BigInt
  razao_social     String
  nome_fantasia    String?
  cnpj             String?
  email            String?
  telefone         String?
  observacoes      String?
  ativo            Boolean   @default(true)
  created_at       DateTime  @default(now())
  updated_at       DateTime  @updatedAt

  empresa          Empresa              @relation(fields: [empresa_id], references: [id])
  enderecos        FornecedorEndereco[]
  contatos         FornecedorContato[]

  @@index([empresa_id])
}

model FornecedorEndereco {
  id               BigInt    @id @default(autoincrement())
  empresa_id       BigInt
  fornecedor_id    BigInt
  cep              String?
  logradouro       String?
  numero           String?
  complemento      String?
  bairro           String?
  cidade           String?
  uf               String?

  fornecedor       Fornecedor @relation(fields: [fornecedor_id], references: [id], onDelete: Cascade)

  @@index([empresa_id])
}

model FornecedorContato {
  id               BigInt    @id @default(autoincrement())
  empresa_id       BigInt
  fornecedor_id    BigInt
  nome             String
  telefone         String?
  email            String?
  cargo            String?

  fornecedor       Fornecedor @relation(fields: [fornecedor_id], references: [id], onDelete: Cascade)

  @@index([empresa_id])
}

model GrupoProduto {
  id               BigInt    @id @default(autoincrement())
  empresa_id       BigInt
  nome             String
  created_at       DateTime  @default(now())

  empresa          Empresa    @relation(fields: [empresa_id], references: [id])
  produtos         Produto[]

  @@index([empresa_id])
}

model Unidade {
  id               BigInt    @id @default(autoincrement())
  empresa_id       BigInt
  nome             String
  sigla            String

  empresa          Empresa    @relation(fields: [empresa_id], references: [id])
  produtos         Produto[]

  @@index([empresa_id])
}

model Produto {
  id               BigInt    @id @default(autoincrement())
  empresa_id       BigInt
  nome             String
  sku              String?
  valor_venda      Decimal   @default(0) @db.Decimal(18, 2)
  valor_custo      Decimal   @default(0) @db.Decimal(18, 2)
  unidade_id       BigInt?
  grupo_id         BigInt?
  descricao        String?
  ativo            Boolean   @default(true)
  created_at       DateTime  @default(now())
  updated_at       DateTime  @updatedAt

  empresa          Empresa        @relation(fields: [empresa_id], references: [id])
  unidade          Unidade?       @relation(fields: [unidade_id], references: [id])
  grupo            GrupoProduto?  @relation(fields: [grupo_id], references: [id])
  lojas            ProdutoLoja[]

  @@index([empresa_id])
}

model ProdutoLoja {
  id               BigInt    @id @default(autoincrement())
  produto_id       BigInt
  empresa_id       BigInt
  estoque_atual    Decimal   @default(0) @db.Decimal(18, 4)
  estoque_minimo   Decimal   @default(0) @db.Decimal(18, 4)

  produto          Produto   @relation(fields: [produto_id], references: [id], onDelete: Cascade)

  @@index([empresa_id])
}

model Servico {
  id               BigInt    @id @default(autoincrement())
  empresa_id       BigInt
  nome             String
  valor            Decimal   @default(0) @db.Decimal(18, 2)
  descricao        String?
  ativo            Boolean   @default(true)
  created_at       DateTime  @default(now())
  updated_at       DateTime  @updatedAt

  empresa          Empresa   @relation(fields: [empresa_id], references: [id])

  @@index([empresa_id])
}

model FormaPagamento {
  id               BigInt    @id @default(autoincrement())
  empresa_id       BigInt
  nome             String
  tipo             String
  ativo            Boolean   @default(true)
  created_at       DateTime  @default(now())

  empresa          Empresa   @relation(fields: [empresa_id], references: [id])

  @@index([empresa_id])
}

model CategoriaFinanceira {
  id               BigInt    @id @default(autoincrement())
  empresa_id       BigInt
  nome             String
  tipo             String
  pai_id           BigInt?
  ativo            Boolean   @default(true)
  created_at       DateTime  @default(now())

  empresa          Empresa               @relation(fields: [empresa_id], references: [id])
  pai              CategoriaFinanceira?  @relation("CategoriaHierarquia", fields: [pai_id], references: [id])
  filhas           CategoriaFinanceira[] @relation("CategoriaHierarquia")

  @@index([empresa_id])
}

model CentroCusto {
  id               BigInt    @id @default(autoincrement())
  empresa_id       BigInt
  nome             String
  descricao        String?
  ativo            Boolean   @default(true)
  created_at       DateTime  @default(now())

  empresa          Empresa   @relation(fields: [empresa_id], references: [id])

  @@index([empresa_id])
}
```

> **Nota:** Valores monetarios sao `Decimal(18,2)` no banco. A camada de servico formata para `"1.500,00"` nas respostas da API e parseia de volta no input, centralizado em `shared/utils/money.ts`.

---

## 11. Seed

Script `prisma/seed.ts` cria:
- 1 Empresa demo ("Empresa Teste LTDA")
- 1 Usuario admin (admin@teste.com / senha: 123456)
- 1 GrupoUsuario "Administrador" com todas as permissoes
- 5 Clientes de exemplo
- 3 Fornecedores de exemplo
- 10 Produtos com grupos e unidades
- 5 Servicos
- Formas de pagamento padrao (Dinheiro, PIX, Cartao Credito, Cartao Debito, Boleto)
- Categorias financeiras basicas (Vendas, Servicos, Salarios, Aluguel, etc.)
- 3 Centros de custo

---

## 12. Decisoes de Design

1. **SPA puro (sem SSR)** — ERP e app interno, nao precisa de SEO
2. **Row-level isolation** — mais simples que schema-per-tenant para MVP
3. **Strings para valores monetarios** — compatibilidade com padrao GestaoClick
4. **POST para editar/excluir** — segue o padrao da API original (nao usa PUT/DELETE)
5. **PrimeVue** — componentes ricos prontos (DataTable, AutoComplete, Calendar, Chart, TreeTable)
6. **Lazy loading por modulo** — performance, cada rota carrega apenas seu chunk
