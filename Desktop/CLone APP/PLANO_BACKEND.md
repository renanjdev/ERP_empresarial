# Plano de Desenvolvimento — Backend do ERP
**Versão:** 1.0
**Data:** 31/03/2026
**Referência:** Mapeamento da API do GestãoClick (`https://app.api.click.app`)

---

## 1. VISÃO GERAL

O backend é uma **API REST JSON** multi-tenant que serve o frontend Vue 3.
Toda a lógica de negócio (cálculos, validações, permissões, fiscal) reside aqui.

### Princípios:
- **Multi-tenant por `empresa_id`** — cada empresa tem seus dados isolados
- **Payload envelope** — `{ "data": { "EntidadePrincipal": {...}, "Relacao[]": [...] } }`
- **IDs como strings** numéricas (compatibilidade com o padrão GestãoClick)
- **Valores monetários como string** no formato `"1.500,00"` (vírgula decimal)
- **Datas como string** `"DD/MM/YYYY"`
- **Booleanos como 0/1**

---

## 2. STACK TECNOLÓGICA

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| Runtime | **Node.js 22 LTS** | Performance, ecossistema fiscal |
| Framework | **Fastify 5** | Mais rápido que Express, schema validation nativo |
| Linguagem | **TypeScript 5** | Tipos, segurança, refatoração |
| ORM | **Prisma 6** | Schema declarativo, migrations, type-safe queries |
| Banco | **PostgreSQL 16** | Multi-tenant, JSONB, índices, confiabilidade |
| Auth | **JWT + Refresh Token** (HttpOnly cookie) | Stateless, seguro |
| Filas | **BullMQ + Redis** | Envio de NF-e, e-mails, webhooks async |
| Cache | **Redis** | Sessões, permissões, dados fiscais (tabelas IBGE) |
| Storage | **S3-compatible (MinIO)** | Fotos de produtos, certificados A1, arquivos |
| Fiscal | **Focus NFe** ou **Plug Notas** | Emissão NF-e/NFC-e/NFS-e via API |
| Testes | **Vitest + Supertest** | Unit + integração |
| Doc | **Scalar** (OpenAPI 3.1) | Docs interativas auto-geradas |

---

## 3. ESTRUTURA DE PASTAS

```
src/
├── modules/                    # Um módulo por domínio
│   ├── auth/
│   │   ├── auth.routes.ts
│   │   ├── auth.service.ts
│   │   └── auth.schema.ts
│   ├── empresas/               # Multi-tenant: lojas/empresas
│   ├── clientes/
│   ├── produtos/
│   ├── pedidos/                # Orçamentos, OS, Vendas, Compras
│   ├── financeiro/
│   ├── notas_fiscais/
│   ├── atendimentos/
│   ├── relatorios/
│   ├── configuracoes/
│   └── usuarios/
├── shared/
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── tenant.middleware.ts
│   │   └── permissoes.middleware.ts
│   ├── plugins/
│   │   ├── prisma.plugin.ts
│   │   ├── redis.plugin.ts
│   │   └── storage.plugin.ts
│   ├── utils/
│   │   ├── money.ts            # parse/format "1.500,00"
│   │   ├── date.ts             # parse/format DD/MM/YYYY
│   │   └── response.ts         # padrão { code, status, message, data }
│   └── types/
│       └── fastify.d.ts        # augment Request com empresa_id, usuario_id
├── jobs/                       # BullMQ workers
│   ├── nfe.job.ts
│   ├── email.job.ts
│   └── relatorio.job.ts
└── app.ts
```

---

## 4. MULTI-TENANT — ESTRATÉGIA

### Abordagem: Row-Level Isolation (mesmas tabelas, `empresa_id` em todas)

```sql
-- Toda tabela tem este campo
empresa_id  BIGINT NOT NULL REFERENCES empresas(id)

-- Índice obrigatório em todas as tabelas
CREATE INDEX idx_{tabela}_empresa_id ON {tabela}(empresa_id);
```

### Middleware de Tenant

```typescript
// Injeta empresa_id em todo request autenticado
fastify.addHook('preHandler', async (req) => {
  const payload = await req.jwtVerify<JwtPayload>()
  req.empresaId = payload.empresa_id
  req.usuarioId = payload.usuario_id
})
```

### Regra de ouro

**Todo** `SELECT`, `INSERT`, `UPDATE`, `DELETE` inclui `empresa_id = req.empresaId`.
O Prisma Middleware garante isso globalmente:

```typescript
prisma.$use(async (params, next) => {
  // Injeta empresa_id em CREATE
  if (params.action === 'create') {
    params.args.data.empresa_id = context.empresaId
  }
  // Injeta filtro em findMany/findFirst
  if (['findMany', 'findFirst', 'count'].includes(params.action)) {
    params.args.where = { ...params.args.where, empresa_id: context.empresaId }
  }
  return next(params)
})
```

---

## 5. AUTENTICAÇÃO

### Fluxo JWT + Refresh Token

```
POST /auth/login
  → valida email/senha
  → emite: access_token (15min, payload: { usuario_id, empresa_id, perfil_id })
  → emite: refresh_token (7 dias, HttpOnly cookie)

POST /auth/refresh
  → lê refresh_token do cookie
  → emite novo access_token

POST /auth/logout
  → invalida refresh_token no Redis

GET /auth/me
  → retorna dados do usuário logado
```

### Schema JWT payload
```typescript
interface JwtPayload {
  usuario_id: string
  empresa_id: string
  perfil_id: string
  lojas: string[]        // IDs das lojas que o usuário tem acesso
  iat: number
  exp: number
}
```

---

## 6. PERMISSÕES

### Modelo baseado no GestãoClick (chaves capturadas)

Permissões são `string` keys associadas a perfis de usuário.

```typescript
type PermissaoKey =
  | 'visualizar_clientes' | 'cadastrar_clientes' | 'editar_clientes' | 'excluir_clientes'
  | 'visualizar_produtos' | 'cadastrar_produtos' | 'editar_produtos' | 'excluir_produtos'
  | 'visualizar_orcamentos' | 'cadastrar_orcamentos' | 'editar_orcamentos' | 'excluir_orcamentos'
  | 'agrupar_orcamentos' | 'agrupar_vendas'
  | 'visualizar_ordens_servicos' | 'cadastrar_ordens_servicos'
  | 'visualizar_vendas' | 'cadastrar_vendas'
  | 'visualizar_compras' | 'cadastrar_compras'
  | 'visualizar_financeiro' | 'cadastrar_financeiro' | 'editar_financeiro'
  | 'emitir_nfe' | 'cancelar_nfe'
  | 'visualizar_relatorios'
  | 'configurar_empresa'
  // ... expandir conforme necessidade
```

### Middleware de permissão

```typescript
// Decorator nas rotas
fastify.get('/clientes', {
  preHandler: [verificarPermissao('visualizar_clientes')]
}, handler)
```

### Tabelas
```sql
perfis (id, empresa_id, nome, descricao)
perfis_permissoes (perfil_id, permissao_key)
usuarios_perfis (usuario_id, perfil_id, loja_id)
```

---

## 7. PADRÃO DE RESPOSTA DA API

Baseado no padrão real do GestãoClick capturado via XHR:

```typescript
// utils/response.ts
interface ApiResponse<T = unknown> {
  code: 200 | 201 | 400 | 401 | 403 | 404 | 422 | 500
  status: 'success' | 'error'
  message: string
  meta?: Record<string, unknown>    // paginação, totais
  data: T
  redirect?: { action: 'index' | 'visualizar'; id?: string }
}

// Sucesso de criação (igual GestãoClick)
{ "code": 200, "status": "success", "message": "Produto cadastrado com sucesso.", "data": "90886768" }

// Erro de validação
{ "code": 422, "status": "error", "message": "O campo nome é obrigatório.", "data": [] }

// Erro de autenticação
{ "code": 401, "status": "error", "message": "Não autorizado.", "data": [] }
```

---

## 8. SCHEMA DO BANCO DE DADOS (Prisma)

### Core — Multi-tenant

```prisma
model Empresa {
  id              BigInt    @id @default(autoincrement())
  nome_fantasia   String
  razao_social    String
  cnpj            String    @unique
  plano           String    @default("basico")
  ativo           Boolean   @default(true)
  criado_em       DateTime  @default(now())

  lojas           Loja[]
  usuarios        Usuario[]
}

model Loja {
  id              BigInt    @id @default(autoincrement())
  empresa_id      BigInt
  empresa         Empresa   @relation(fields: [empresa_id], references: [id])
  nome            String
  tipo_pessoa     String    @default("PJ")  // PJ | PF | ES
  cnpj            String?
  cpf             String?
  razao_social    String?
  inscricao_estadual String?
  inscricao_municipal String?
  regime_tributario  Int?   // 1=SN, 2=SN excesso, 3=Normal, 4=MEI
  cep             String?
  logradouro      String?
  numero          String?
  complemento     String?
  bairro          String?
  cidade_id       BigInt?
  ativo           Boolean   @default(true)

  @@index([empresa_id])
}

model Usuario {
  id              BigInt    @id @default(autoincrement())
  empresa_id      BigInt
  empresa         Empresa   @relation(fields: [empresa_id], references: [id])
  nome            String
  email           String
  senha_hash      String
  ativo           Boolean   @default(true)
  criado_em       DateTime  @default(now())

  @@unique([empresa_id, email])
  @@index([empresa_id])
}
```

### Cadastros

```prisma
model Cliente {
  id              BigInt    @id @default(autoincrement())
  empresa_id      BigInt
  tipo_pessoa     String    // PF | PJ | ES
  nome            String
  cpf             String?
  cnpj            String?
  razao_social    String?
  inscricao_estadual String?
  email           String?
  telefone        String?
  celular         String?
  tipo            String    @default("CL")  // CL | FOR | CL_FOR
  limite_credito  Decimal   @default(0) @db.Decimal(15,2)
  ativo           Boolean   @default(true)
  vendedor_id     BigInt?
  criado_em       DateTime  @default(now())
  modificado_em   DateTime  @updatedAt

  enderecos       ClienteEndereco[]
  contatos        ClienteContato[]
  atributos       ClienteAtributo[]

  @@index([empresa_id])
  @@index([empresa_id, tipo_pessoa])
}

model ClienteEndereco {
  id              BigInt    @id @default(autoincrement())
  cliente_id      BigInt
  empresa_id      BigInt
  cep             String?
  logradouro      String?
  numero          String?
  complemento     String?
  bairro          String?
  cidade_id       BigInt?
  principal       Boolean   @default(false)

  @@index([empresa_id, cliente_id])
}

model Produto {
  id              BigInt    @id @default(autoincrement())
  empresa_id      BigInt
  nome            String
  codigo          String?
  codigo_barra    String?
  grupo_id        BigInt?
  marca_id        BigInt?
  unidade_entrada_id BigInt?
  unidade_saida_id   BigInt?
  movimenta_estoque  Boolean @default(true)
  possui_nf       Boolean   @default(true)
  possui_variacao Boolean   @default(false)
  possui_composicao Boolean @default(false)
  valor_custo     Decimal   @default(0) @db.Decimal(15,4)
  valor_custo_medio Decimal @default(0) @db.Decimal(15,4)
  peso            Decimal?  @db.Decimal(10,3)
  largura         Decimal?  @db.Decimal(10,3)
  altura          Decimal?  @db.Decimal(10,3)
  comprimento     Decimal?  @db.Decimal(10,3)
  comercializavel_pdv Boolean @default(true)
  ativo           Boolean   @default(true)
  criado_em       DateTime  @default(now())
  modificado_em   DateTime  @updatedAt

  // Fiscal
  ncm             String?
  cest            String?
  icms_origem     Int?      // 0-8
  c_benef         String?
  peso_liquido    Decimal?  @db.Decimal(10,3)
  peso_bruto      Decimal?  @db.Decimal(10,3)
  n_fci           String?
  produto_especifico String? // V M A C P

  estoques        ProdutoEstoque[]
  precos          ProdutoPreco[]
  tributacoes     ProdutoTributacao[]
  fotos           ProdutoFoto[]
  fornecedores    ProdutoFornecedor[]

  @@index([empresa_id])
  @@index([empresa_id, codigo])
}

model ProdutoEstoque {
  id              BigInt    @id @default(autoincrement())
  empresa_id      BigInt
  produto_id      BigInt
  loja_id         BigInt
  quantidade      Decimal   @default(0) @db.Decimal(15,4)
  estoque_minimo  Decimal   @default(0) @db.Decimal(15,4)
  estoque_maximo  Decimal   @default(0) @db.Decimal(15,4)

  @@unique([produto_id, loja_id])
  @@index([empresa_id])
}

model ProdutoPreco {
  id              BigInt    @id @default(autoincrement())
  empresa_id      BigInt
  produto_id      BigInt
  tipo_valor_id   BigInt
  valor_venda     Decimal   @db.Decimal(15,2)
  lucro_utilizado Decimal   @db.Decimal(5,2)
  lucro_sugerido  Decimal   @db.Decimal(5,2)

  @@unique([produto_id, tipo_valor_id])
  @@index([empresa_id])
}

model ProdutoTributacao {
  id              BigInt    @id @default(autoincrement())
  empresa_id      BigInt
  produto_id      BigInt
  // ICMS
  cst_icms        String?   // CST ou CSOSN
  cfop            String?
  base_calculo_icms Decimal? @db.Decimal(15,2)
  aliquota_icms   Decimal?  @db.Decimal(7,4)
  // PIS
  cst_pis         String?
  aliquota_pis    Decimal?  @db.Decimal(7,4)
  // COFINS
  cst_cofins      String?
  aliquota_cofins Decimal?  @db.Decimal(7,4)
  // IPI
  cst_ipi         String?
  aliquota_ipi    Decimal?  @db.Decimal(7,4)

  @@index([empresa_id, produto_id])
}
```

### Pedidos (Orçamentos, OS, Vendas, Compras — tabela unificada)

```prisma
model Pedido {
  id              BigInt    @id @default(autoincrement())
  empresa_id      BigInt
  loja_id         BigInt
  tipo            String    // ORC_PROD | ORC_SERV | OS | VENDA | COMPRA
  codigo          String?
  data            DateTime
  previsao_entrega DateTime?
  cliente_id      BigInt?
  fornecedor_id   BigInt?
  vendedor_id     BigInt?
  tecnico_id      BigInt?
  situacao_id     BigInt?
  canal_venda_id  BigInt?
  centro_custo_id BigInt?
  forma_pagamento_id BigInt?
  numero_parcelas Int       @default(1)
  valor_produtos  Decimal   @default(0) @db.Decimal(15,2)
  valor_servicos  Decimal   @default(0) @db.Decimal(15,2)
  valor_frete     Decimal   @default(0) @db.Decimal(15,2)
  valor_outros    Decimal   @default(0) @db.Decimal(15,2)
  valor_impostos  Decimal   @default(0) @db.Decimal(15,2)
  desconto_valor  Decimal   @default(0) @db.Decimal(15,2)
  desconto_porcentagem Decimal @default(0) @db.Decimal(7,4)
  valor_total     Decimal   @default(0) @db.Decimal(15,2)
  observacoes     String?
  criado_em       DateTime  @default(now())
  modificado_em   DateTime  @updatedAt

  itens           PedidoItem[]
  parcelas        PedidoParcela[]
  equipamentos    PedidoEquipamento[]
  endereco        PedidoEndereco?

  @@index([empresa_id, tipo])
  @@index([empresa_id, cliente_id])
}

model PedidoItem {
  id              BigInt    @id @default(autoincrement())
  empresa_id      BigInt
  pedido_id       BigInt
  tipo            String    @default("P")  // P=produto, S=serviço
  produto_id      BigInt?
  nome_produto    String
  detalhes        String?
  quantidade      Decimal   @db.Decimal(15,4)
  valor_custo     Decimal   @default(0) @db.Decimal(15,4)
  valor_venda     Decimal   @db.Decimal(15,2)
  desconto_valor  Decimal   @default(0) @db.Decimal(15,2)
  desconto_porcentagem Decimal @default(0) @db.Decimal(7,4)
  valor_total     Decimal   @db.Decimal(15,2)
  ordem           Int       @default(0)

  @@index([empresa_id, pedido_id])
}

model PedidoEquipamento {
  id              BigInt    @id @default(autoincrement())
  empresa_id      BigInt
  pedido_id       BigInt
  equipamento     String?
  marca           String?
  modelo          String?
  serie           String?
  condicoes       String?
  defeitos        String?
  acessorios      String?
  solucao         String?
  laudo           String?
  termos_garantia String?

  @@index([empresa_id, pedido_id])
}
```

### Financeiro

```prisma
model MovimentacaoFinanceira {
  id              BigInt    @id @default(autoincrement())
  empresa_id      BigInt
  loja_id         BigInt
  tipo            String    // R=recebimento, P=pagamento
  nome            String
  entidade        String?   // C=cliente, F=fornecedor
  cliente_id      BigInt?
  fornecedor_id   BigInt?
  categoria_id    BigInt?
  centro_custo_id BigInt?
  conta_bancaria_id BigInt?
  forma_pagamento_id BigInt?
  valor           Decimal   @db.Decimal(15,2)
  juros           Decimal   @default(0) @db.Decimal(15,2)
  desconto        Decimal   @default(0) @db.Decimal(15,2)
  valor_total     Decimal   @db.Decimal(15,2)
  data_vencimento DateTime
  data_competencia DateTime?
  data_baixa      DateTime?
  baixado         Boolean   @default(false)
  ocorrencia      String    @default("U")  // U=única, R=recorrente
  pedido_id       BigInt?   // vínculo com venda/compra
  criado_em       DateTime  @default(now())

  parcelas        MovimentacaoFinanceiraParcela[]
  categorias      MovimentacaoFinanceiraCategoria[]

  @@index([empresa_id, tipo])
  @@index([empresa_id, data_vencimento])
  @@index([empresa_id, baixado])
}

model ContaBancaria {
  id              BigInt    @id @default(autoincrement())
  empresa_id      BigInt
  loja_id         BigInt
  nome            String
  banco           String?
  agencia         String?
  conta           String?
  saldo_inicial   Decimal   @default(0) @db.Decimal(15,2)
  ativo           Boolean   @default(true)

  @@index([empresa_id])
}
```

### Atendimentos

```prisma
model Chamado {
  id              BigInt    @id @default(autoincrement())
  empresa_id      BigInt
  loja_id         BigInt
  cliente_id      BigInt?
  usuario_id      BigInt    // atendente
  tipo            String    @default("R")  // R=receptivo, A=ativo
  visibilidade    Int       @default(0)    // 0=restrito, 1=público
  assunto_id      BigInt?
  forma_atendimento_id BigInt?
  situacao_id     BigInt
  descricao       String?
  criado_em       DateTime  @default(now())
  modificado_em   DateTime  @updatedAt

  @@index([empresa_id, situacao_id])
  @@index([empresa_id, cliente_id])
}

model ChamadoAssunto {
  id              BigInt    @id @default(autoincrement())
  empresa_id      BigInt
  nome            String
  ativo           Boolean   @default(true)
  @@index([empresa_id])
}

model ChamadoSituacao {
  id              BigInt    @id @default(autoincrement())
  empresa_id      BigInt
  nome            String
  cor             String?
  @@index([empresa_id])
}
```

### NF-e

```prisma
model NotaFiscal {
  id              BigInt    @id @default(autoincrement())
  empresa_id      BigInt
  loja_id         BigInt
  tipo            String    // NFE | NFCE | NFSE
  numero          Int
  serie           String    @default("1")
  chave_acesso    String?   @unique
  status          String    @default("PENDENTE")  // PENDENTE | AUTORIZADA | CANCELADA | REJEITADA
  ambiente        Int       @default(1)           // 1=producao, 2=homologacao
  pedido_id       BigInt?
  cliente_id      BigInt?
  valor_total     Decimal   @db.Decimal(15,2)
  data_emissao    DateTime  @default(now())
  xml_assinado    String?   @db.Text
  xml_protocolo   String?   @db.Text
  pdf_danfe       String?   // path no S3

  @@index([empresa_id, tipo, status])
}
```

---

## 9. ENDPOINTS POR MÓDULO

### Convenções
- `GET    /{recurso}`              → listar (paginado, com filtros via query string)
- `GET    /{recurso}/{id}`         → visualizar
- `POST   /{recurso}/adicionar`    → criar
- `PUT    /{recurso}/editar/{id}`  → atualizar
- `DELETE /{recurso}/excluir/{id}` → excluir (soft delete: `ativo = false`)
- `GET    /{recurso}/busca{Recurso}` → autocomplete (retorna `[{id, nome}]`)

### Auth
```
POST /auth/login
POST /auth/logout
POST /auth/refresh
GET  /auth/me
```

### Clientes & Cadastros
```
GET    /clientes
GET    /clientes/:id
POST   /clientes/adicionar
PUT    /clientes/editar/:id
DELETE /clientes/excluir/:id
GET    /clientes/buscaClientes?q=           → autocomplete

GET    /fornecedores
POST   /fornecedores/adicionar
GET    /fornecedores/buscaFornecedores?q=

GET    /funcionarios
POST   /funcionarios/adicionar
GET    /funcionarios/buscaFuncionarios?q=

GET    /transportadoras
POST   /transportadoras/adicionar
```

### Produtos
```
GET    /produtos/index
GET    /produtos/:id
POST   /produtos/adicionar
PUT    /produtos/editar/:id
DELETE /produtos/excluir/:id
POST   /produtos/verificaCodigo             → valida unicidade do código
GET    /produtos/buscaProdutos?q=           → autocomplete
GET    /produtos/buscaProdutosEstoque?q=    → autocomplete com estoque

GET    /grupos_produtos
POST   /grupos_produtos/adicionar
GET    /unidades
POST   /unidades/adicionar
GET    /marcas_produtos
POST   /marcas_produtos/adicionar
```

### Pedidos (Orçamentos / OS / Vendas / Compras)
```
# Orçamentos
GET    /orcamentos_produtos
POST   /orcamentos_produtos/adicionar
PUT    /orcamentos_produtos/editar/:id
DELETE /orcamentos_produtos/excluir/:id
POST   /orcamentos_produtos/duplicar/:id
POST   /orcamentos_produtos/converter/:id   → converte para venda

# OS
GET    /ordens_servicos
POST   /ordens_servicos/adicionar
PUT    /ordens_servicos/editar/:id
DELETE /ordens_servicos/excluir/:id

# Vendas
GET    /vendas
POST   /vendas/adicionar
PUT    /vendas/editar/:id

# Compras
GET    /compras
POST   /compras/adicionar
PUT    /compras/editar/:id

# Auxiliares (compartilhados)
GET    /situacoes_pedidos/buscaSituacoes?q=
GET    /canais_venda/buscaCanaisVenda?q=
GET    /centros_custo/buscaCentrosCusto?q=
```

### Financeiro
```
GET    /movimentacoes_financeiras/index_recebimento
GET    /movimentacoes_financeiras/index_pagamento
POST   /movimentacoes_financeiras/adicionar_recebimento
POST   /movimentacoes_financeiras/adicionar_pagamento
PUT    /movimentacoes_financeiras/editar/:id
POST   /movimentacoes_financeiras/baixar/:id            → dar baixa
DELETE /movimentacoes_financeiras/excluir/:id

GET    /contas_bancarias
GET    /contas_bancarias/buscaContasBancarias?q=
POST   /contas_bancarias/adicionar

GET    /formas_pagamentos
GET    /formas_pagamentos/buscaFormasPagamentos?q=
POST   /formas_pagamentos/adicionar

GET    /categorias_movimentacoes_financeiras
GET    /categorias_movimentacoes_financeiras/buscaCategorias?q=
POST   /categorias_movimentacoes_financeiras/adicionar

GET    /caixas/abrir
POST   /caixas/adicionar
```

### Notas Fiscais
```
GET    /notas_fiscais
GET    /notas_fiscais/:id
POST   /notas_fiscais/emitir           → envia para fila de emissão
POST   /notas_fiscais/cancelar/:id
GET    /notas_fiscais/danfe/:id        → retorna PDF do DANFE
GET    /notas_fiscais/xml/:id          → retorna XML

GET    /notas_fiscais/configuracoes    → wizard config
POST   /notas_fiscais/configuracoes    → salva config
POST   /notas_fiscais/certificado      → upload A1 (.pfx)
```

### Atendimentos
```
GET    /atendimentos/chamados
POST   /atendimentos/chamados/adicionar
PUT    /atendimentos/chamados/editar/:id
DELETE /atendimentos/chamados/excluir/:id

GET    /atendimentos/assuntos
GET    /atendimentos/situacoes
GET    /atendimentos/formas_atendimento
```

### Relatórios
```
GET    /relatorios_financeiros/relatorio_contas_receber?{filtros}
GET    /relatorios_financeiros/relatorio_contas_pagar?{filtros}
GET    /relatorios_financeiros/relatorio_dre?{filtros}
GET    /relatorios_financeiros/relatorio_extrato?{filtros}
GET    /relatorios_estoque/relatorio_estoque_produtos?{filtros}
GET    /relatorios_estoque/relatorio_compras?{filtros}
GET    /relatorios_ordens_servicos/ordens_servicos?{filtros}
GET    /relatorios_notas_fiscais/nfe?{filtros}

# Todos os relatórios aceitam ?formato=json|pdf|xlsx
```

### Configurações
```
GET    /configuracoes/dados_empresa
PUT    /configuracoes/dados_empresa

GET    /configuracoes/geral               → EmpresasConfiguracao
PUT    /configuracoes/geral

GET    /usuarios/permissoes
POST   /usuarios/adicionar
PUT    /usuarios/editar/:id

GET    /planos/meu_plano                  → dados do plano ativo
```

---

## 10. REGRAS DE NEGÓCIO CRÍTICAS

### Estoque
- Toda venda confirmada com `movimenta_estoque = true` deve **decrementar** `ProdutoEstoque.quantidade`
- Toda compra confirmada deve **incrementar** estoque
- Cancelamento reverte o movimento
- `estoque_minimo` dispara alerta (notificação/e-mail)

### Financeiro
- Venda confirmada deve **gerar automaticamente** `MovimentacaoFinanceira` por parcela
- `data_baixa` preenchida + `baixado = true` deve atualizar saldo da `ContaBancaria`
- Movimentação com `ocorrencia = "R"` (recorrente): gerar parcelas no período configurado

### Pedidos
- `valor_total = valor_produtos + valor_servicos + valor_frete + valor_outros - desconto_valor + valor_impostos`
- Itens têm `chave` (float aleatório) como ID temporário no frontend; o backend ignora esse campo
- Código auto-incrementado por empresa: `MAX(codigo) + 1` no contexto da empresa

### NF-e
- Ambiente `2` (homologação): CNPJ do destinatário sempre substituído por `99.999.999/9999-99` na API fiscal
- Numeração sequencial por série: `MAX(numero) WHERE serie = X AND empresa_id = Y`
- Upload do certificado A1: criptografar senha com AES-256 antes de armazenar no banco

---

## 11. LISTAGEM — PAGINAÇÃO E FILTROS

### Query string padrão
```
GET /clientes?page=1&per_page=20&q=João&ativo=1&order_by=nome&order_dir=asc
```

### Resposta paginada
```json
{
  "code": 200,
  "status": "success",
  "data": [ {...}, {...} ],
  "meta": {
    "total": 347,
    "page": 1,
    "per_page": 20,
    "total_pages": 18
  }
}
```

### Autocomplete
```
GET /clientes/buscaClientes?q=João&loja_id=123
```
```json
{
  "code": 200,
  "status": "success",
  "data": [
    { "id": "456", "nome": "João Silva", "cpf": "123.456.789-00" }
  ]
}
```

---

## 12. FILAS ASSÍNCRONAS (BullMQ)

| Job | Trigger | O que faz |
|-----|---------|-----------|
| `emitir_nfe` | `POST /notas_fiscais/emitir` | Chama API Focus/PlugNotas, salva chave+XML |
| `cancelar_nfe` | `POST /notas_fiscais/cancelar/:id` | Chama cancelamento, atualiza status |
| `send_email` | Venda/OS confirmada | Envia e-mail com PDF para o cliente |
| `gerar_relatorio_pdf` | `GET /relatorios?formato=pdf` | Gera PDF via Puppeteer, salva no S3 |
| `gerar_relatorio_xlsx` | `GET /relatorios?formato=xlsx` | Gera Excel via ExcelJS, salva no S3 |
| `recorrencia_financeira` | CRON diário 06:00 | Gera parcelas de movimentações recorrentes |
| `alerta_estoque` | Após movimentação | Verifica estoque mínimo e notifica |

---

## 13. VARIÁVEIS DE AMBIENTE

```env
# App
NODE_ENV=production
PORT=3000
API_URL=https://api.seudominio.com.br

# Banco
DATABASE_URL=postgresql://user:pass@host:5432/erp_db

# Redis
REDIS_URL=redis://host:6379

# Auth
JWT_SECRET=<256-bit-secret>
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Storage (S3)
S3_ENDPOINT=https://s3.seudominio.com.br
S3_BUCKET=erp-files
S3_ACCESS_KEY=...
S3_SECRET_KEY=...

# Fiscal
FOCUSNFE_TOKEN=...
FOCUSNFE_ENV=producao     # producao | homologacao

# Email
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=...
SMTP_PASS=...
SMTP_FROM=noreply@seudominio.com.br

# Criptografia
CERT_ENCRYPTION_KEY=<AES-256-key>
```

---

## 14. ROADMAP DE SPRINTS — BACKEND

| Sprint | Duração | Entregável |
|--------|---------|-----------|
| 1 | 1 semana | Setup: Fastify + Prisma + PostgreSQL + Docker Compose + CI |
| 2 | 1 semana | Auth: JWT, refresh token, middleware de tenant e permissões |
| 3 | 2 semanas | Cadastros: Clientes, Fornecedores, Funcionários, Transportadoras |
| 4 | 2 semanas | Produtos: CRUD, grupos, unidades, marcas, estoque, preços |
| 5 | 2 semanas | Pedidos: Orçamentos (produtos + serviços), OS |
| 6 | 1 semana | Pedidos: Vendas, Compras |
| 7 | 2 semanas | Financeiro: movimentações, contas bancárias, formas de pagamento, PDV |
| 8 | 2 semanas | NF-e: wizard, certificado A1, emissão via fila, DANFE/XML |
| 9 | 1 semana | Atendimentos: chamados, assuntos, situações |
| 10 | 2 semanas | Relatórios: financeiro, estoque, OS, NF-e (JSON + PDF + XLSX) |
| 11 | 1 semana | Configurações: empresa, lojas, usuários, permissões, planos |
| 12 | 2 semanas | Testes (Vitest + Supertest), QA, deploy em produção |

**Total estimado: ~19 semanas**

---

## 15. DOCKER COMPOSE (desenvolvimento local)

```yaml
version: '3.9'
services:
  api:
    build: .
    ports: ['3000:3000']
    env_file: .env
    depends_on: [db, redis]

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: erp_db
      POSTGRES_USER: erp
      POSTGRES_PASSWORD: erp_secret
    ports: ['5432:5432']
    volumes: ['pgdata:/var/lib/postgresql/data']

  redis:
    image: redis:7-alpine
    ports: ['6379:6379']

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    ports: ['9000:9000', '9001:9001']
    volumes: ['miniodata:/data']

volumes:
  pgdata:
  miniodata:
```

---

## 16. REFERÊNCIAS

- **Mapeamento GestãoClick:** `gestaoclick_mapeamento.md`
- **Plano Frontend:** `PLANO_DESENVOLVIMENTO.md`
- **API GestãoClick detectada:** `https://app.api.click.app`
- **Padrão de payload:** `{ "data": { "EntidadePrincipal": {...} } }`
- **Repositório:** https://github.com/renanjdev/ERP_empresarial
