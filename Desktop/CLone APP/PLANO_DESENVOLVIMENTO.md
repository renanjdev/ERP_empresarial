# Plano de Desenvolvimento — Clone do GestãoClick ERP
**Versão:** 1.0
**Data:** 31/03/2026
**Base de pesquisa:** Mapeamento completo via navegação e interceptação de rede

---

## 1. VISÃO GERAL DO PROJETO

Construir um ERP SaaS multi-tenant similar ao GestãoClick com os módulos:
Clientes, Fornecedores, Produtos, Estoque, Compras, Orçamentos, Ordens de Serviço,
Vendas, Financeiro, Notas Fiscais, Contratos, Relatórios e Configurações.

---

## 2. STACK TECNOLÓGICA RECOMENDADA

### Frontend (baseado na stack detectada no GestãoClick)
| Camada | GestãoClick usa | Recomendação para o clone |
|--------|----------------|--------------------------|
| Framework JS | **Vue 2.x** | **Vue 3 + Composition API** |
| UI Components | **BootstrapVue** | **Nuxt UI** ou **PrimeVue** ou **Element Plus** |
| CSS | Bootstrap 4/5 | Tailwind CSS + shadcn/vue |
| State Management | **Vuex** (módulos: planos, usuarios, dominios, notificacoes, menus, validator) | **Pinia** |
| HTTP Client | Fetch nativo / XHR | **Axios** |
| Roteamento | Vue Router | **Vue Router 4** |
| Bundler | Webpack (chunks visíveis) | **Vite** |
| Gráficos | Google Charts / Chart.js | **ApexCharts** ou **Chart.js** |
| Tabelas | Customizadas | **TanStack Table** |
| Formulários | Vue + validação customizada | **VeeValidate + Zod** |
| Upload | Customizado | **vue-upload-component** |
| Editor Rich Text | Textarea simples | **Tiptap** ou **QuillJS** |

### Backend
| Camada | Recomendação |
|--------|-------------|
| API | **Node.js + Fastify** ou **Laravel 11** |
| Banco de dados | **PostgreSQL** (multi-tenant com schema por empresa) |
| ORM | **Prisma** (Node) ou **Eloquent** (Laravel) |
| Autenticação | **JWT + Refresh Token** ou **Laravel Sanctum** |
| Filas | **BullMQ** (Node) ou **Laravel Queues** |
| Storage | **S3-compatible** (MinIO para self-hosted) |
| Fiscal | Integração com **Focus NFe API** ou **Plug Notas** |

### Infraestrutura
| Item | Recomendação |
|------|-------------|
| Hospedagem API | Railway / Render / VPS (Ubuntu) |
| Hospedagem Frontend | Vercel / Cloudflare Pages |
| Banco | Supabase (PostgreSQL gerenciado) ou PlanetScale |
| CDN | Cloudflare |
| E-mail | Resend / SendGrid |
| Domínio/SSL | Cloudflare |

---

## 3. ARQUITETURA DO SISTEMA

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Vue 3 SPA)                  │
│                  app.seudominio.com.br                    │
└─────────────────────────┬───────────────────────────────┘
                          │ HTTPS + JSON
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   API REST (Backend)                     │
│               api.seudominio.com.br                      │
│                                                          │
│  /clientes, /produtos, /orcamentos, /ordens_servicos     │
│  /compras, /movimentacoes_financeiras, /notas_fiscais    │
└──────────────┬──────────────────────┬───────────────────┘
               │                      │
               ▼                      ▼
        PostgreSQL              Redis (cache/filas)
        (multi-tenant)
```

### Padrão de Payload da API (igual ao GestãoClick)
```json
// REQUEST
POST /produtos/adicionar
{
  "data": {
    "Produto": { ...campos },
    "ProdutosTributacao": { ... },
    "ProdutosLoja": [ ... ]
  }
}

// RESPONSE (sucesso)
{ "code": 200, "status": "success", "message": "Cadastrado.", "data": "<id>" }

// RESPONSE (erro)
{ "code": 422, "status": "error", "message": "Campo obrigatório.", "data": [] }
```

---

## 4. ESTRUTURA VUEX / PINIA (detectada no GestãoClick)

```
store/
├── modules/
│   ├── usuarios.js      → token, tokenDispositivo, usuarioLogado
│   ├── planos.js        → empresaPlano (controle de features por plano)
│   ├── dominios.js      → dominio (multi-tenant por URL)
│   ├── notificacoes.js  → notificacoesNovas, notificacoes, notificacoesSistema
│   ├── menus.js         → menus (dinâmico por perfil), visivel (sidebar aberta/fechada)
│   └── validator.js     → validator (erros de formulário globais)
```

---

## 5. MÓDULOS A DESENVOLVER (por prioridade)

### Fase 1 — Core (MVP)
```
[ ] Autenticação (login, logout, recuperação de senha)
[ ] Multi-tenant (empresa por subdomínio ou código)
[ ] Dashboard (widgets: a receber, a pagar, fluxo de caixa, gráficos)
[ ] Clientes (CRUD + endereços + contatos + atributos extras)
[ ] Fornecedores (CRUD)
[ ] Produtos (CRUD + grupos + unidades + estoque + fiscal)
[ ] Serviços (CRUD)
[ ] Formas de Pagamento (CRUD)
[ ] Plano de contas / Categorias financeiras
[ ] Centros de Custo
```

### Fase 2 — Transacional
```
[ ] Orçamentos de Produtos
[ ] Orçamentos de Serviços
[ ] Ordens de Serviço (equipamento, técnico, situações)
[ ] Compras (produtos + serviços)
[ ] Cotações de Compra
[ ] Contratos de Serviço
[ ] Devoluções
```

### Fase 3 — Financeiro
```
[ ] Contas a Receber
[ ] Contas a Pagar
[ ] Contas Bancárias
[ ] Fluxo de Caixa
[ ] DRE Gerencial
[ ] Boletos Bancários (integração banco)
[ ] Importação de Extrato (OFX)
[ ] Transferência entre contas
[ ] Contas fixas (recorrentes)
```

### Fase 4 — Fiscal
```
[ ] NF-e 4.0 (produtos)
[ ] NFC-e 4.0 (PDV)
[ ] NFS-e (serviços)
[ ] Importação de XML (compras)
[ ] Certificado Digital A1/A3
[ ] NCM / CEST / Natureza de Operação
[ ] Tributações por produto
```

### Fase 5 — PDV e Relatórios
```
[ ] PDV (caixa, sangria, fechamento)
[ ] Etiquetas de produto
[ ] Relatórios (financeiro, estoque, vendas, comissões)
[ ] Exportação para Excel
[ ] Envio por e-mail
[ ] Backup de dados
```

### Fase 6 — Configurações e Extras
```
[ ] Perfis de usuário (grupos + permissões)
[ ] Multi-loja / filiais
[ ] Atributos customizados por módulo
[ ] Integrações (Asaas, Mercado Pago, etc.)
[ ] Agenda / Atendimentos
[ ] Controle de acesso granular
```

---

## 6. ESTRUTURA DE PASTAS (Frontend Vue 3)

```
src/
├── assets/
├── components/
│   ├── common/
│   │   ├── AppHeader.vue
│   │   ├── AppSidebar.vue
│   │   ├── AppBreadcrumb.vue
│   │   ├── DataTable.vue          ← tabela padrão de listagem
│   │   ├── FormAutocomplete.vue   ← busca com API
│   │   ├── MoneyInput.vue         ← input monetário (vírgula decimal)
│   │   ├── DateInput.vue          ← input data DD/MM/YYYY
│   │   ├── FileUpload.vue
│   │   └── StatusBadge.vue
│   ├── financeiro/
│   ├── produtos/
│   ├── clientes/
│   ├── pedidos/                   ← compartilhado entre orçamento/OS/venda
│   └── fiscal/
├── composables/
│   ├── useApi.js                  ← wrapper HTTP com interceptors
│   ├── useAutocomplete.js         ← busca com debounce
│   ├── useForm.js                 ← submit + validação + loading
│   ├── useNotifications.js
│   └── usePermissions.js
├── layouts/
│   ├── DefaultLayout.vue          ← com sidebar + header
│   └── AuthLayout.vue             ← login/recuperação
├── pages/                         ← uma pasta por módulo
│   ├── dashboard/
│   ├── clientes/
│   │   ├── index.vue              ← listagem
│   │   ├── adicionar.vue          ← formulário novo
│   │   └── [id]/
│   │       ├── visualizar.vue
│   │       └── editar.vue
│   ├── produtos/
│   ├── orcamentos_produtos/
│   ├── ordens_servicos/
│   ├── compras/
│   ├── movimentacoes_financeiras/
│   └── ...
├── router/
│   └── index.js
├── services/                      ← chamadas API por módulo
│   ├── clientesService.js
│   ├── produtosService.js
│   ├── pedidosService.js
│   └── ...
└── stores/                        ← Pinia
    ├── auth.js
    ├── plano.js
    ├── notificacoes.js
    ├── menus.js
    └── ui.js
```

---

## 7. COMPONENTES CRÍTICOS A IMPLEMENTAR

### 7.1 `FormAutocomplete.vue`
Presente em TODOS os formulários. Comportamento:
- Input com `placeholder="Digite para buscar"`
- Debounce de ~300ms
- Chama `GET /{modulo}/busca{Modulo}?q=texto`
- Exibe dropdown com resultados
- Ao selecionar: preenche `_id` + `nome_campo` no model
- Exemplo de uso: cliente, vendedor, produto, NCM, CEST, centro de custo

### 7.2 `MoneyInput.vue`
- Máscara monetária BR: `1.500,00`
- Internamente armazena como string com vírgula (igual à API)
- Suporta: valor, desconto, custo, total

### 7.3 `DataTable.vue`
- Colunas configuráveis
- Paginação server-side
- Filtros: período, busca, status
- Ações: visualizar, editar, excluir, imprimir
- Exportar para Excel

### 7.4 `PedidoForm.vue` (compartilhado)
Usado por Orçamento, OS e Venda. Seções:
1. Dados gerais (cabeçalho)
2. Itens (tabela dinâmica de produtos/serviços)
3. Totais (subtotal, desconto, frete, total)
4. Pagamento (à vista / parcelado)
5. Transporte
6. Endereço de entrega
7. Anexos
8. Observações

### 7.5 `ItemPedido.vue`
Linha de item dentro de um pedido/OS/compra:
```js
{
  tipo: 'P',              // P = Produto, S = Serviço
  produto_id: '',
  nome_produto: '',
  quantidade: '',
  valor_venda: '',
  desconto_valor: '',
  desconto_porcentagem: '',
  valor_total: '',
  chave: Math.random()   // ID temporário no frontend
}
```

---

## 8. MODELO DE DADOS (principais entidades)

### Convenções detectadas
- IDs são **strings numéricas** (ex: `"498215"`)
- Valores monetários: **string com vírgula** (`"1.500,00"`)
- Datas: **DD/MM/YYYY** (string)
- Booleanos: **0 / 1** (integer)
- Arrays de itens têm campo `chave` (float random) como key temporária

### Entidades principais e seus relacionamentos
```
Empresa (loja)
  ├── Usuarios
  │   └── GruposUsuarios (permissões)
  ├── Clientes / Fornecedores
  │   ├── ClientesEndereco[]
  │   └── ClientesContato[]
  ├── Produtos
  │   ├── ProdutosLoja (estoque por loja)
  │   ├── ProdutosTributacao (ICMS, PIS, COFINS)
  │   └── ProdutosTiposValoresProduto (preços por tabela)
  ├── Pedidos (Orçamento / OS / Venda / Compra)
  │   ├── PedidosProduto[] (itens)
  │   ├── PedidosParcela[] (pagamento)
  │   ├── PedidosEquipamento[] (apenas OS)
  │   └── PedidosEndereco
  ├── MovimentacoesFinanceiras
  │   ├── MovimentacoesFinanceirasParcela[]
  │   └── MovimentacoesFinanceirasCategoria[]
  └── NotasFiscais
      └── NotasFiscaisItens[]
```

---

## 9. ENDPOINTS DA API A IMPLEMENTAR

### Padrão REST por módulo
```
GET    /{modulo}/index              → listagem paginada + filtros
GET    /{modulo}/visualizar/{id}    → detalhes
POST   /{modulo}/adicionar          → criar
POST   /{modulo}/editar/{id}        → editar (não usa PUT/PATCH)
POST   /{modulo}/excluir/{id}       → excluir (não usa DELETE)
```

### Endpoints de Autocomplete (busca)
```
GET /clientes/buscaClientes?q=           → busca clientes
GET /fornecedores/buscaFornecedores?q=   → busca fornecedores
GET /produtos/buscaProdutos?loja=&q=     → busca produtos
GET /produtos/buscaProdutosCompras?q=    → busca para compras
GET /servicos/buscaServicos/?loja=&q=    → busca serviços
GET /transportadoras/buscaTransportadoras?q=
GET /centros_custos/buscaCentrosCustos?q=
GET /formas_pagamentos/buscaFormasPagamentos/?tipo=&q=
GET /contas_bancarias/buscaContasBancarias?q=
GET /categorias_movimentacoes_financeiras/buscaCategorias?tipo=&q=
GET /cidades/buscaCidades?q=
GET /cidades/busca_cep/?cep=
GET /ncm/buscaNcm?referencia=&q=
GET /cest/buscaCest?q=
GET /grupos_produtos/buscaGrupos?q=
GET /usuarios/buscaUsuarios?q=
```

### Endpoints de sistema
```
GET /usuarios/verifica_autenticacao      → valida sessão ativa
GET /notificacoes/novas_notificacoes     → badge de notificações
GET /notificacoes/notificacoes_sistema   → alertas do sistema
GET /planos/meu_plano                   → features do plano ativo
GET /sistema/carrega_integracoes        → integrações disponíveis
```

---

## 10. FLUXO DE AUTENTICAÇÃO

```
1. POST /usuarios/login
   Body: { "data": { "Usuario": { "email": "", "senha": "" } } }
   Retorna: { token, usuarioLogado, empresaPlano }

2. Armazenar token no Pinia (store/auth.js)
   + localStorage para persistência

3. Axios interceptor → adiciona header:
   Authorization: Bearer <token>

4. Em toda requisição: GET /usuarios/verifica_autenticacao
   Se 401 → redirecionar para /login

5. Multi-tenant: identificar empresa por:
   - Subdomínio: empresa.seuapp.com.br
   - Ou: header X-Empresa-ID
   - Ou: campo loja_id no payload (como no GestãoClick)
```

---

## 11. MULTI-TENANT

O GestãoClick usa `loja_id` em todos os payloads para identificar a empresa.
Cada usuário pode ter acesso a múltiplas lojas (filiais).

**Estratégia recomendada para o clone:**
```
- Um banco PostgreSQL
- Schema separado por empresa: CREATE SCHEMA empresa_<id>
- Tabelas comuns (usuarios, planos) no schema public
- Middleware de tenant: identifica empresa pelo subdomínio ou token
- loja_id presente em todas as queries
```

---

## 12. CONTROLE DE PERMISSÕES

Detectado no GestãoClick via `permissao*` flags no componente Vue:
```js
// Exemplo de flags de permissão no estado Vue
permissaoCadastrarCliente: true/false
permissaoCadastrarProduto: true/false
permissaoConcederDesconto: true/false
permissaoAlterarValorVenda: true/false
permissaoVisualizarCliente: true/false
permissaoCadastrarTransportadora: true/false
permissaoAlterarSituacao: true/false
permissaoCadastrarFormaPagamento: true/false
permissaoCadastrarCentroCusto: true/false
```

**Implementar como:**
- Tabela `permissoes` com flags por módulo
- Tabela `grupos_usuarios` com permissões por grupo
- Diretiva Vue `v-can="'cadastrar_cliente'"` para esconder botões
- Guard de rota no Vue Router

---

## 13. SITUAÇÕES / STATUS POR MÓDULO

| Módulo | Situações |
|--------|-----------|
| Orçamento | Em aberto, Aprovado, Recusado, Expirado |
| Venda | Em aberto, Concretizada, Cancelada |
| OS | Em aberto, Em andamento, Aguardando peça, Finalizada, Cancelada |
| Compra | Em aberto, Recebida, Cancelada |
| Contrato | Ativo, Suspenso, Encerrado, Cancelado |
| Financeiro | Em aberto, Baixado, Vencido, Cancelado |
| NF-e | Rascunho, Autorizada, Cancelada, Inutilizada |

---

## 14. CONVENÇÕES DE CÓDIGO

Baseadas no que foi detectado no GestãoClick:

### Nomenclatura de API
- Entidade principal: `PascalCase` (ex: `Produto`, `MovimentacoesFinanceira`)
- Relações: `PascalCase + Plural` (ex: `ProdutosLoja`, `PedidosParcela`)
- Campos: `snake_case` (ex: `valor_custo`, `data_vencimento`)
- IDs de referência: `entidade_id` + `nome_entidade` (ex: `cliente_id` + `nome_cliente`)

### Campos extras customizáveis
O GestãoClick usa `campo_aux_texto_1`, `campo_aux_texto_2`, `campo_aux_float_1`
em vários módulos. Implementar campos extras configuráveis por empresa.

### Chave temporária de item
Items em listas (produtos, parcelas) têm campo `chave: Math.random()`
usado como key no `v-for` antes de salvar.

---

## 15. CRONOGRAMA SUGERIDO

| Sprint | Duração | Entregável |
|--------|---------|------------|
| 1 | 2 semanas | Setup, autenticação, multi-tenant, layout base |
| 2 | 2 semanas | Cadastros: Clientes, Fornecedores, Funcionários |
| 3 | 2 semanas | Produtos: CRUD, grupos, unidades, estoque básico |
| 4 | 2 semanas | Orçamentos (produtos e serviços) |
| 5 | 2 semanas | Ordens de Serviço |
| 6 | 2 semanas | Compras + Cotações |
| 7 | 2 semanas | Financeiro: contas a pagar/receber, fluxo de caixa |
| 8 | 2 semanas | Relatórios básicos + Dashboard completo |
| 9 | 3 semanas | NF-e / NFC-e / NFS-e (fiscal) |
| 10 | 2 semanas | PDV + Contratos + Configurações |
| 11 | 2 semanas | Permissões, multi-loja, ajustes finais |
| 12 | 2 semanas | Testes, QA, deploy em produção |

**Total estimado: ~24 semanas (6 meses)**

---

## 16. MÓDULO FISCAL — PRODUTO (Tab Fiscal)

### Campos fiscais do produto (aba "Fiscal"):
| Campo | ID | Descrição |
|-------|----|-----------|
| `cBenef` | text | Código de benefício fiscal |
| `ncm` | autocomplete | NCM — Nomenclatura Comum do Mercosul |
| `cest2` | autocomplete | CEST — Código Especificador da Substituição Tributária |
| `ICMS_orig2` | select | Origem (0=Nacional, 1-8=estrangeiro/especial) |
| `pesoL2` | decimal | Peso líquido (kg) |
| `pesoB2` | decimal | Peso bruto (kg) |
| `nFCI_Opc` | text | Número FCI |
| `produto_especifico` | select | V=Veículo, M=Medicamento, A=Armamento, C=Combustível, P=Papel imune |

### Regras Fiscais (`ProdutosTributacao`):
Configuradas por produto para ICMS, PIS, COFINS, IPI. Cada regra contém:
- CST/CSOSN (dependendo do regime tributário)
- Alíquota e base de cálculo
- Modalidade de determinação da BC
- Redução da BC
- CFOP (Código Fiscal de Operações e Prestações)

---

## 17. MÓDULO ATENDIMENTOS / CHAMADOS

### Stack interna:
- URL base: `/atendimentos`
- É um sub-sistema com navegação própria (sidebar diferente)
- Entidade principal: `Chamado`

### Campos principais do Chamado:
```
cliente_id, usuario_id (atendente), tipo (R/A), visibilidade (0/1),
assunto_id, forma_atendimento_id, situacao_id, descricao
```

### Entidades auxiliares:
- `Assunto` — categorias de chamado (configurable por loja)
- `FormaAtendimento` — canal (telefone, email, chat, presencial, etc.)
- `Situacao` — estados do chamado (Em aberto, Em andamento, Atendido, Cancelado)
- `AtendimentosAtributo` — campos extras configuráveis

### Pinia store sugerido:
```ts
// stores/atendimentos.ts
interface Chamado {
  cliente_id: string | null
  usuario_id: string
  tipo: 'R' | 'A'
  visibilidade: 0 | 1
  assunto_id: string | null
  forma_atendimento_id: string | null
  situacao_id: string
  descricao: string | null
}
```

---

## 18. NF-e — WIZARD DE CONFIGURAÇÃO

### 4 Etapas:
1. **Dados da empresa** — `Loja`: tipo_pessoa, razao_social, cnpj, inscricao_estadual/municipal, regime_tributario, regime_especial_tributacao, endereço completo, cnae
2. **Certificado digital** — tipo A1 (upload .pfx + senha) ou A3 (token físico)
3. **Configurações** — `LojasConfiguracao`: numeracao_nf, numeracao_serie_nfe, nota_fiscal_ambiente (1=Produção, 2=Homologação)
4. **Confirmação** — revisão e ativação

### Regimes tributários:
```
1 = Simples Nacional
2 = Simples Nacional - excesso de sublimite
3 = Regime Normal
4 = MEI
```

### Componente Vue sugerido: `<NFeWizard>` com 4 steps, validação por etapa antes de avançar.

---

## 19. REFERÊNCIAS

- **Mapeamento completo:** `gestaoclick_mapeamento.md`
- **API base detectada:** `https://app.api.click.app`
- **Frontend detectado:** Vue 2.x + BootstrapVue + Vuex
- **Stack Vuex:** módulos: planos, usuarios, dominios, notificacoes, menus, validator
- **Repositório:** https://github.com/renanjdev/ERP_empresarial
