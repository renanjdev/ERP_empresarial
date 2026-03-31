# Mapeamento Completo do GestãoClick ERP
**URL Base:** https://gestaoclick.com
**Data do mapeamento:** 31/03/2026
**Usuário:** Renan Januário Silva

---

## 1. DASHBOARD (Início)
**URL:** `/inicio`

### Widgets do Dashboard:
- **A receber hoje** (verde) → link para `/movimentacoes_financeiras/index_recebimento`
- **A pagar hoje** (laranja) → link para `/movimentacoes_financeiras/index_pagamento`
- **Recebimentos do mês** (azul) — gráfico de donut com: Realizado, Falta, Previsto
- **Pagamentos do mês** (azul) — gráfico de donut com: Realizado, Falta, Previsto
- **Fluxo de caixa** — gráfico de linha temporal (out 2025 a mar 2026)
- **Gráfico de vendas** — gráfico de linha temporal
- **Contas bancárias** — gráfico de barras (ex: Santander R$1.495,55 / Sicredi R$20.489,43)
- **Calendário** — calendário mensal

### Header / Topbar:
- Logo GestãoClick (link para `/inicio`)
- Botão hamburger (colapsar menu)
- Ícone de apps/módulos
- Ícone de notificações
- Avatar/perfil do usuário

### Integrações visíveis no Dashboard ("Meus aplicativos"):
- site_builder, asaas, conta_integrada, recursos_humanos, assinatura_digital, agenda_pro, indicadores, mdfe, serasa, tray, mercado_pago, mercado_livre
- Link: "Ver todos os aplicativos" → `/integracoes`

### Atualizações do sistema:
- Feed de atualizações visível no dashboard, cada uma com link `/atualizacoes/visualizar/{id}`

---

## 2. MENU LATERAL — Estrutura Completa

```
├── Cadastros
│   ├── Clientes              → /clientes
│   ├── Fornecedores          → /fornecedores
│   ├── Funcionários          → /funcionarios
│   ├── Transportadoras       → /transportadoras
│   └── Opções auxiliares     → (submenu)
│
├── Produtos
│   ├── Gerenciar produtos    → /produtos/index
│   ├── Valores de venda      → (submenu)
│   ├── Etiquetas             → (submenu)
│   └── Opções auxiliares     → (submenu)
│
├── Serviços
│   └── Gerenciar serviços    → /servicos
│
├── Orçamentos
│   ├── Produtos              → /orcamentos_produtos
│   ├── Serviços              → /orcamentos_servicos
│   └── Opções auxiliares     → (submenu)
│
├── Ordens de serviços
│   ├── Gerenciar O.S.        → /ordens_servicos
│   ├── Painel                → /ordens_servicos_painel/index
│   └── Opções auxiliares     → (submenu)
│
├── Vendas
│   ├── Produtos              → /vendas_produtos
│   ├── Balcão                → /vendas_balcao
│   ├── Serviços              → /vendas_servicos
│   └── Opções auxiliares     → (submenu)
│
├── Estoque
│   ├── Movimentações         → /produtos/index?movimentacoes=true
│   ├── Ajustes               → /ajustes_estoques
│   ├── Transferências        → /transferencias_estoques
│   ├── Cotações              → /cotacoes
│   ├── Compras               → (submenu)
│   ├── Trocas e devoluções   → /devolucoes
│   └── Opções auxiliares     → (submenu)
│
├── Financeiro
│   ├── Contas a pagar        → /movimentacoes_financeiras/index_pagamento
│   ├── Contas a receber      → /movimentacoes_financeiras/index_recebimento
│   ├── DRE gerencial         → /movimentacoes_financeiras/dre_gerencial
│   ├── Fluxo de caixa        → /movimentacoes_financeiras/fluxo_caixa
│   ├── Boletos bancários     → (submenu)
│   └── Opções auxiliares     → (submenu)
│
├── Notas fiscais
│   ├── Notas de produtos     → /notas_fiscais          (NF-e)
│   ├── Notas de serviços     → /notas_fiscais_servicos  (NFS-e/RPS)
│   ├── Notas do consumidor   → /notas_fiscais_consumidores (NFC-e)
│   ├── Notas de compras      → /notas_fiscais_compras
│   └── Opções auxiliares     → (submenu)
│
├── Contratos
│   ├── Serviços              → /contratos_servicos
│   ├── Locações              → /locacoes
│   ├── Assinaturas           → /servicos_recorrentes
│   └── Opções auxiliares     → (submenu)
│
├── Atendimentos              → /atendimentos/chamados   (módulo separado)
│
├── Relatórios
│   ├── Cadastros             → /relatorios_cadastros
│   ├── Vendas                → /relatorios_vendas
│   ├── Ordens de serviços    → (relatorios OS)
│   ├── Estoque               → (relatorios estoque)
│   ├── Financeiro            → (relatorios financeiro)
│   ├── Contratos             → (relatorios contratos)
│   ├── Notas fiscais         → (relatorios NF)
│   └── Logs do sistema       → (logs)
│
└── Configurações
    ├── Gerais                → /configuracoes/gerais
    ├── Meu plano             → /planos/meu_plano
    ├── Usuários              → /usuarios
    ├── Dados da empresa      → /configuracoes/dados_empresa
    ├── Marca da empresa      → /configuracoes/marca_empresa
    ├── Empresas / Lojas      → /lojas
    ├── Certificado digital   → /configuracoes/certificado_digital
    ├── Modelos de e-mails    → /modelos_emails/index
    └── Avisos por e-mail     → /avisos
```

---

## 3. MÓDULO: CADASTROS

### 3.1 Clientes (`/clientes`)
**Listagem — colunas:** Nome, Documento (CNPJ/CPF), Telefone, Situação, Ações
**Ações por linha:** Visualizar, Editar, Deletar
**Botão "Mais ações":** Importar de uma planilha | Importar de notas fiscais | Exportar clientes | Exportar e-mails | Excluir clientes
**Busca:** Por nome + Busca avançada

**Formulário Adicionar Cliente** (`/clientes/adicionar`):
- **Dados gerais:** Tipo de cliente (PF/PJ), Situação (Ativo/Inativo), Nome*, E-mail, Telefone comercial, Telefone celular, FAX, Site, Vendedor/Responsável
- **Endereços:** Tipo, CEP, Logradouro, Número, Complemento, Bairro, Cidade/UF + botão "Inserir novo endereço"
- **Contatos:** botão "Inserir novo contato"
- **Financeiro:** Limite de crédito + checkbox "Permitir exceder"
- **Foto:** Upload JPG/GIF até 5Mb
- **Anexos:** Upload até 5Mb
- **Observações:** textarea livre
- **Botões:** Cadastrar (verde) | Cancelar (vermelho)

**Visualizar Cliente:**
- Dados gerais: Tipo de cliente, Razão social, CNPJ, Inscrição estadual, Tipo de contribuinte, Inscrição municipal, Inscrição SUFRAMA, Responsável, Telefone, E-mail, País, Vendedor, Limite de crédito, Permitir ultrapassar limite, Cadastrado por, Cadastrado em, Modificado em
- Contatos, Endereço (com badge "Endereço principal"), Vendas (tabela com Código, Tipo, Data, Prazo de Entrega, Situação, Valor total), Anexos

**URL Pattern:**
- `/clientes` — listagem
- `/clientes/adicionar` — novo
- `/clientes/visualizar/{id}` — detalhe
- `/clientes/editar/{id}` — edição

### 3.2 Fornecedores (`/fornecedores`)
**Colunas:** Nome, Documento, Telefone, Situação, Ações
**Mesmo padrão de Clientes**
**Botão "Mais ações":** mesmas opções de importar/exportar

### 3.3 Funcionários (`/funcionarios`)
**Colunas:** Nome, E-mail, Telefone, **Permite acesso** (diferencial — controle de acesso ao sistema), Situação, Ações
**Obs:** Funcionários podem ter login no sistema (coluna "Permite acesso")

### 3.4 Transportadoras (`/transportadoras`)
- Módulo para cadastro de empresas de frete
- Integração automática nas vendas e NF-e
- Vazio na conta analisada

### 3.5 Opções auxiliares (Cadastros)
- Subcategorias configuráveis para os cadastros

---

## 4. MÓDULO: PRODUTOS

**URL:** `/produtos/index`
**Colunas listagem:** Código, Nome, Valor, Estoque, Ações
**Ações por linha:** Visualizar, Editar, Mover estoque, Excluir
**Submenu:** Gerenciar produtos | Valores de venda | Etiquetas | Opções auxiliares

**Formulário Adicionar Produto — 8 ABAS:**

### Aba Dados:
- Nome*, Código interno*, Código de barra, Grupo do produto
- Movimenta estoque? (Sim/Não)
- Habilitar nota fiscal? (Sim/Não)
- Possui variações? (Sim/Não)
- Possui composição? (Sim/Não)
- **Conversão de unidade:** Entrada (Qtd + Unidade) = Saída (Qtd + Unidade) — permite comprar em kg e vender em gramas, por ex.

### Aba Detalhes:
- **Pesos e dimensões:** Peso (kg), Largura (m), Altura (m), Comprimento (m)
- **Campos extras:** customizáveis (ex: Marca, Modelo)
- **Detalhes:** checkboxes — Produto ativo, Vendido separadamente, Comercializável no PDV
- Comissão (%)
- **Descrição do produto:** textarea

### Aba Valores:
- **Valores de custo:** Valor de custo*, Despesas acessórias, Outras despesas, Custo final* (calculado)
- **Valores de venda:** Lucro sugerido (%), Lucro utilizado (%), Valor de venda sugerido (R$), Valor de venda utilizado (R$)
- Botão "Calcular valor de venda" + "Cadastrar novo valor de venda"

### Aba Estoque:
- Estoque mínimo, Estoque máximo, Quantidade atual

### Aba Fotos:
- Upload de imagens do produto

### Aba Fiscal:
- Cód. benefício, NCM (busca), CEST (busca), Origem
- Peso líquido, Peso bruto, Número FCI, Produto específico
- **Regras fiscais:** tabela + botões "Adicionar regra" | "Regras por NCM" | "Regras por grupo"

### Aba Composição:
- Para produtos compostos (kits)

### Aba Fornecedores:
- Associar fornecedores ao produto

---

## 5. MÓDULO: SERVIÇOS

**URL:** `/servicos`
**Colunas listagem:** Código, Nome, Valor de custo, Valor de venda, Ações
**Submenu:** Gerenciar serviços

**Serviços cadastrados (exemplo da conta):**
- Homologação 10,1 kW a 25 kW
- Homologação >10kW
- Instalação - Entrada/Saída - Poste Padrão CPFL
- Pacotes de homologação (5, 10, 15, 20, 25 unidades)
- Projeto Elétrico - Medição Agrupada
- Responsabilidade Técnica ANUAL
- Serviços Técnicos
- Tramitação Concessionária - Aumento de Carga sem Projeto

---

## 6. MÓDULO: ORÇAMENTOS

### 6.1 Orçamentos de Produtos (`/orcamentos_produtos`)
### 6.2 Orçamentos de Serviços (`/orcamentos_servicos`)

**Formulário Adicionar Orçamento:**
- **Dados gerais:** Número (automático), Cliente*, Vendedor/Responsável, Data*, Prazo de entrega, Aos cuidados de, Validade, Canal de venda* (Presencial/etc), Centro de custo, Introdução (texto que aparece na proposta)
- **Serviços:** tabela — Serviço*, Detalhes, Quant.*, Valor*, Desconto, Subtotal + "Adicionar serviço"
- **Produtos:** tabela — Produto*, Detalhes, Quant.*, Valor*, Desconto, Subtotal + "Adicionar produto"
- **Transporte:** Valor do frete, Transportadora
- **Endereço de entrega:** checkbox "Informar endereço de entrega"
- **Total:** Produtos, Serviços, Desconto (R$), Desconto (%), Valor total*
- **Pagamento:** checkbox "Gerar condições de pagamento" → À vista / Parcelado
- **Anexos:** Upload até 5Mb
- **Observações:** (impressa no pedido)
- **Observações internas:** (não impressa)

**Funcionalidades:**
- Transformar orçamento em venda com um clique
- Enviar para cliente via e-mail
- Imprimir orçamento
- Acompanhar situação (Aberto, Aprovado, Recusado, etc.)
- Filtro por período (ex: "Março de 2026")

---

## 7. MÓDULO: ORDENS DE SERVIÇOS

**URLs:** `/ordens_servicos` | `/ordens_servicos_painel/index`

**Formulário Adicionar O.S.:**
- **Dados gerais:** Número, Cliente*, Situação* (Em aberto), Entrada* (data+hora), Saída (data+hora), Canal de venda*, Centro de custo, Prioridade
- **Responsáveis:** Vendedor/Responsável, Técnico (campo separado!)
- **Equipamentos:** Equipamento*, Marca, Modelo, Série, Condições (textarea), Defeitos (textarea), Acessórios (textarea), Solução (textarea), Laudo (textarea), Termos (textarea) + "Adicionar equipamento"
- **Produtos/Peças:** tabela — Produto*, Detalhes, Quant.*, Valor*, Desconto, Subtotal
- **Serviços/Mão de obra:** tabela — Serviço*, Detalhes, Quant.*, Valor*, Desconto, Subtotal
- Transporte, Total, Pagamento, Anexos, Observações

**Painel O.S.:** View Kanban/painel das O.S. por situação

---

## 8. MÓDULO: VENDAS

### 8.1 Vendas de Produtos (`/vendas_produtos`)
### 8.2 Vendas Balcão (`/vendas_balcao`) — PDV
### 8.3 Vendas de Serviços (`/vendas_servicos`)

**Formulário Adicionar Venda:**
- **Dados gerais:** Número (automático), Cliente*, Vendedor/Responsável, Situação* (Concretizada), Data*, Prazo de entrega, Canal de venda*, Centro de custo
- **Serviços:** tabela (igual ao orçamento)
- **Produtos:** tabela (igual ao orçamento)
- Transporte, Total, Pagamento, Anexos, Observações, Observações internas

**Funcionalidades:**
- Ao confirmar venda → atualiza estoque automaticamente
- Ao confirmar venda → gera recebimento no financeiro
- Gerar boleto bancário
- Enviar venda para cliente via e-mail
- Imprimir venda

---

## 9. MÓDULO: ESTOQUE

**Submenu:**
- **Movimentações** (`/produtos/index?movimentacoes=true`) — histórico de movimentações
- **Ajustes** (`/ajustes_estoques`) — ajuste manual de estoque
- **Transferências** (`/transferencias_estoques`) — entre lojas/depósitos
- **Cotações** (`/cotacoes`) — cotação de compras
- **Compras** — sub-submenu (entrada de produtos)
- **Trocas e devoluções** (`/devolucoes`) — devoluções de vendas

---

## 10. MÓDULO: FINANCEIRO

**Submenu:**
- **Contas a pagar** (`/movimentacoes_financeiras/index_pagamento`)
- **Contas a receber** (`/movimentacoes_financeiras/index_recebimento`)
- **DRE gerencial** (`/movimentacoes_financeiras/dre_gerencial`)
- **Fluxo de caixa** (`/movimentacoes_financeiras/fluxo_caixa`)
- **Boletos bancários** — sub-submenu
- **Opções auxiliares** — sub-submenu

**Funcionalidades:**
- Gerar boleto bancário para clientes
- Enviar boleto por e-mail
- Imprimir recibo
- Acompanhar vencimentos
- Detectar inadimplências
- Enviar e-mails periódicos de cobrança
- Integração automática com vendas

**Contas bancárias visíveis:**
- Santander: R$ 1.495,55
- Sicredi: R$ 20.489,43

---

## 11. MÓDULO: NOTAS FISCAIS

**Submenu:**
- **Notas de produtos** (`/notas_fiscais`) — NF-e (Nota Fiscal Eletrônica)
- **Notas de serviços** (`/notas_fiscais_servicos`) — NFS-e / RPS
- **Notas do consumidor** (`/notas_fiscais_consumidores`) — NFC-e
- **Notas de compras** (`/notas_fiscais_compras`)
- **Opções auxiliares**

**Funcionalidades NF-e:**
- Emitir NF-e
- Armazenar XML das notas
- Enviar DANFE e XML para clientes/fornecedores via e-mail
- Imprimir DANFE
- Baixar XML
- Obter histórico
- Cancelar notas
- Importar certificado digital
- Importar notas emitidas externamente

---

## 12. MÓDULO: CONTRATOS

**Submenu:**
- **Serviços** (`/contratos_servicos`)
- **Locações** (`/locacoes`)
- **Assinaturas** (`/servicos_recorrentes`) — contratos recorrentes
- **Opções auxiliares**

**Funcionalidades:**
- Controlar contratos de serviço
- Atualizar financeiro automaticamente ao confirmar
- Gerar boletos bancários
- Acompanhar situação de cada contrato
- Relatórios e gráficos

---

## 13. MÓDULO: ATENDIMENTOS

**URL:** `/atendimentos/chamados`
**Obs: Módulo totalmente separado com menu próprio!**

**Menu lateral próprio (diferente do ERP principal):**
- Início
- Chamados
- Relatórios
- Opções auxiliares
- Configurações
- Sistema ERP (volta ao ERP)

**Funcionalidades:**
- Organizar chamados de suporte/negociação
- Histórico completo de contatos com cliente
- Organização por equipe
- Estatísticas de chamados
- Acompanhar qual cliente mais demanda tempo da equipe

---

## 14. MÓDULO: RELATÓRIOS

**URL base:** `/relatorios_*`

**Submenu:**
- Cadastros (`/relatorios_cadastros`)
- Vendas (`/relatorios_vendas`)
- Ordens de serviços
- Estoque
- Financeiro
- Contratos
- Notas fiscais
- Logs do sistema

**Relatórios de Vendas** (`/relatorios_vendas`) — 12 tipos:
1. Relatório de orçamentos (filtro: loja, tipo, período, cliente, vendedor, situação)
2. Relatório de vendas (filtro: loja, tipo, período, cliente, vendedor, situação)
3. Produtos vendidos (filtro: loja, cliente, produto, tipo, período, grupo, vendedor, situação)
4. Relatório de devoluções (filtro: loja, venda, período, cliente, valor)
5. Produtos devolvidos (filtro: loja, cliente, grupo, produto, período)
6. Serviços prestados (filtro: loja, cliente, serviço, tipo, período, vendedor, situação)
7. Clientes que mais compram (filtro: loja, tipo, período, cliente, vendedor, situação)
8. Comissão por venda (filtro: loja, vendedor, período, situação)
9. Comissão por produto (filtro: loja, vendedor, período, situação)
10. Comissão por serviço (filtro: loja, vendedor, período, situação)
11. Curva ABC de produtos (filtro: loja, período, tipo, situação, canal, classe ABC)
12. Curva ABC de clientes (filtro: loja, período, clientes, vendedor, situação, classe ABC)

---

## 15. MÓDULO: CONFIGURAÇÕES

**URL:** `/configuracoes/gerais`

### 15.1 Configurações Gerais — 7 abas:

**Aba Dados gerais:**
- Casas decimais valor (2-10)
- Casas decimais quantidade (nenhuma, 2-10)
- Limite de registro por página (20, 30, 40... 100)
- Estoque produto composição (Controlar/Não controlar)
- Produto sem estoque (Permitir/Não permitir vender)
- Vender sem condições de pagamento (Permitir/Não permitir)
- Valor de custo do produto (Valor médio / Último exato / Não atualizar)
- Permitir acesso do suporte (Sim/Não)

**Aba Numerações:**
Sequência atual de cada módulo (configurável):
- Clientes: 28 | Fornecedores: 2 | Transportadoras: 0 | Orçamentos: 159
- Vendas: 163 | Ordens de serviços: 0 | Contrato: 1 | Locação: 0
- Financeiro: 489 | NF-e: 0 | NFC-e: 0 | RPS (NFS-e): 0
- Cotação: 0 | Compra: 0 | Ajuste de estoque: 0 | Atendimento: 0

**Aba Movimentações:**
- Configurações de movimentações financeiras

**Aba Fiscal:**
- **NF-e:** Última NF-e, Série NF-e (1), Ambiente (Produção), Versão (4.00), Informações complementares, Base de cálculo PIS/COFINS, Exibir DANFE simplificado
- **NFC-e:** Última NFC-e, Série NFC-e (2), Token, CSC, Ambiente, Versão (4.00)

**Aba Notificações:**
- Configurações de notificações automáticas

**Aba SMTP:**
- Configuração de servidor de e-mail próprio

**Aba Domínio próprio:**
- Configuração de domínio personalizado

### 15.2 Meu plano (`/planos/meu_plano`)
### 15.3 Usuários (`/usuarios`) — controle de acesso
### 15.4 Dados da empresa (`/configuracoes/dados_empresa`)
### 15.5 Marca da empresa (`/configuracoes/marca_empresa`) — logo, cores
### 15.6 Empresas / Lojas (`/lojas`) — multi-loja
### 15.7 Certificado digital (`/configuracoes/certificado_digital`) — A1/A3
### 15.8 Modelos de e-mails (`/modelos_emails/index`) — templates
### 15.9 Avisos por e-mail (`/avisos`) — alertas automáticos

---

## 16. PADRÕES DE UI E UX

### Padrão de Listagem (Tabelas):
- Botão verde "Adicionar"
- Botão cinza "Mais ações" (dropdown com importar/exportar/excluir em massa)
- Ícone de visualização de lista/grade
- Campo de busca por nome
- Botão "Busca avançada" (filtros múltiplos)
- Filtro de período ("Março de 2026") nas páginas transacionais
- Breadcrumb: Início > Módulo > Ação
- Paginação: "Mostrando 1 a X de um total de Y"
- **Ações por linha:** 3 ícones coloridos — azul (visualizar), laranja (editar), vermelho (excluir)
- Coluna "Situação" com ícone verde de check

### Padrão de Formulários:
- Seções com cabeçalho (ícone + nome da seção)
- Campos obrigatórios marcados com *
- Campos com hint (ícone ?)
- Botões no rodapé: verde "Cadastrar" / vermelho "Cancelar"
- Formulários de produto: abas horizontais no topo
- Upload com aviso de tamanho máximo (5Mb)
- Campos "Digite para buscar" — autocomplete com backend

### Padrão de URLs:
```
/{modulo}                     → listagem
/{modulo}/adicionar           → formulário de criação
/{modulo}/visualizar/{id}     → detalhes
/{modulo}/editar/{id}         → formulário de edição
```

### Padrão de Módulos Transacionais (Vendas, OS, Orçamentos):
Todos seguem a mesma estrutura de formulário:
1. Dados gerais (cabeçalho)
2. Itens (serviços e/ou produtos em tabela)
3. Transporte (frete)
4. Endereço de entrega
5. Total (subtotais + desconto + total)
6. Pagamento (à vista ou parcelado)
7. Anexos
8. Observações (pública + interna)

---

## 17. INTEGRAÇÕES DISPONÍVEIS

Visíveis no dashboard "Meus aplicativos":
- **Asaas** — pagamentos e boletos
- **Conta Integrada** — conta bancária PJ dentro do ERP
- **Mercado Pago** — pagamentos
- **Mercado Livre** — marketplace
- **Tray** — e-commerce
- **SERASA** — consulta de crédito
- **MDF-e** — manifesto de documentos fiscais eletrônicos
- **Assinatura Digital** — assinar documentos
- **Agenda PRO** — agendamento
- **Indicadores** — dashboard de KPIs
- **RH** (recursos_humanos) — módulo de RH
- **Site Builder** — criador de sites/landing pages

---

## 18. TECNOLOGIAS PERCEPTÍVEIS

- **Frontend:** HTML tradicional (server-side rendering), Bootstrap para grid e componentes
- **Componentes interativos:** Dropdowns, tabs, modais, autocomplete/busca typeahead
- **Gráficos:** Google Charts ou Chart.js (gráficos de linha, donut, barras)
- **Calendário:** Componente de calendário customizado
- **Upload:** Upload de arquivos com preview (fotos de produtos/clientes)
- **Autenticação:** Cookie/sessão (usuário permanece logado entre navegações)
- **Multi-tenant:** Suporte a múltiplas lojas/empresas sob o mesmo plano
- **Emissão fiscal:** Integração com SEFAZ para NF-e 4.0, NFC-e 4.0, NFS-e (RPS)

---

## 19. FUNCIONALIDADES TRANSVERSAIS

- **Canal de venda:** Campo presente em Orçamentos, Vendas, O.S. — ex: "Presencial", "Online", etc.
- **Centro de custo:** Campo presente em Orçamentos, Vendas, O.S. — categoriza despesas/receitas
- **Vendedor/Responsável:** Campo em Clientes, Orçamentos, Vendas, O.S.
- **Situação:** Cada módulo tem fluxo de situações próprio:
  - Venda: Concretizada, Em aberto, Cancelada...
  - O.S.: Em aberto, Em andamento, Finalizada...
  - Orçamento: Aberto, Aprovado, Recusado, Expirado...
- **Filtro de período:** Presente em todas as listagens transacionais
- **Busca avançada:** Múltiplos filtros em todas as listagens principais
- **Exportação:** Exportar para planilha disponível em vários módulos
- **Impressão:** Documentos (orçamento, venda, O.S., NF-e) têm botão de imprimir
- **E-mail:** Envio direto de documentos por e-mail ao cliente

---

## 20. OBSERVAÇÕES PARA CLONAGEM

1. **Arquitetura MVC tradicional** — rotas REST simples, sem SPA aparente
2. **Multi-módulo** — Atendimentos é um sub-aplicativo separado com menu próprio
3. **Numeração automática** — cada módulo tem sequência configurável
4. **Integração fiscal completa** — NF-e 4.0, NFC-e 4.0, NFS-e
5. **Fluxo de conversão:** Orçamento → Venda → NF-e → Financeiro (automático)
6. **Controle de acesso por usuário** — funcionários podem ou não ter acesso ao sistema
7. **Multi-loja** — suporte a múltiplas filiais/lojas
8. **Campos obrigatórios comuns:** Nome, Cliente, Data, Canal de venda
9. **Busca por autocomplete** em todos os campos relacionais (cliente, produto, serviço, etc.)
10. **Certificado digital A1/A3** necessário para emissão de NF-e

---

## 21. ENDPOINTS DE API DESCOBERTOS (Autocomplete / AJAX)

> **Base:** `https://gestaoclick.com` (mesma origem — não é API separada para autocomplete)
> Capturado via interceptação XHR/Fetch durante navegação.

### Autenticação / Sistema
| Método | Endpoint | Parâmetros |
|--------|----------|------------|
| GET | `/usuarios/verifica_autenticacao` | — |
| GET | `/notificacoes/novas_notificacoes` | — |
| GET | `/notificacoes/notificacoes_sistema` | — |
| GET | `/usuarios/meus_dados` | — |
| GET | `/planos/meu_plano` | — |
| GET | `/sistema/carrega_integracoes` | — |
| GET | `/modalidades/validar_url` | — |

### Cadastros — Autocomplete/Busca
| Método | Endpoint | Parâmetros |
|--------|----------|------------|
| GET | `/clientes/buscaClientes` | `q` |
| GET | `/clientes/busca_limite_credito` | `id` |
| GET | `/clientes/busca_pendencias` | `id` |
| GET | `/fornecedores/buscaFornecedores` | `q` |
| GET | `/transportadoras/buscaTransportadoras` | `q` |
| GET | `/usuarios/buscaUsuarios` | `q` |
| GET | `/cidades/buscaCidades` | `q` |
| GET | `/cidades/busca_cep/` | `cep` |

### Financeiro — Autocomplete/Busca
| Método | Endpoint | Parâmetros |
|--------|----------|------------|
| GET | `/categorias_movimentacoes_financeiras/buscaCategorias` | `tipo`, `q` |
| GET | `/centros_custos/buscaCentrosCustos` | `q` |
| GET | `/formas_pagamentos/buscaFormasPagamentos/` | `tipo`, `q` |
| GET | `/formas_pagamentos/buscaFormaPagamento` | `q` |
| GET | `/contas_bancarias/buscaContasBancarias` | `q` |

### Produtos / Estoque — Autocomplete/Busca
| Método | Endpoint | Parâmetros |
|--------|----------|------------|
| GET | `/produtos/buscaProdutos` | `loja`, `q` |
| GET | `/produtos/buscaProdutosCompras` | `produtos`, `loja`, `q` |
| GET | `/servicos/buscaServicos/` | `loja`, `q` |
| GET | `/grupos_produtos/buscaGrupos` | `q` |
| GET | `/ncm/buscaNcm` | `referencia`, `q` |
| GET | `/ncm/pesquisa_ncm` | `q` |
| GET | `/cest/buscaCest` | `q` |

### Ações Especiais (não-CRUD)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/caixas/abrir_caixa` | Abertura de caixa PDV |
| POST | `/movimentacoes_financeiras/agrupar_pagamento` | Agrupar pagamentos |
| POST | `/movimentacoes_financeiras/agrupar_recebimento` | Agrupar recebimentos |
| POST | `/movimentacoes_financeiras/exportar_remessa` | Exportar remessa bancária |
| POST | `/movimentacoes_financeiras/importar_extrato` | Importar extrato bancário |
| POST | `/movimentacoes_financeiras/importar_retorno` | Importar retorno bancário |
| GET  | `/movimentacoes_financeiras/imprimir_boletos` | Imprimir boletos |
| POST | `/notas_fiscais/importar_xml` | Importar XML NF-e |
| GET  | `/notas_fiscais/listar_cartas_correcoes` | Listar CC-e |
| GET  | `/notas_fiscais/listar_inutilizacoes_numeracoes` | Listar inutilizações |
| GET  | `/notas_fiscais_consumidores/listar_inutilizacoes_numeracoes` | Inutilizações NFC-e |
| POST | `/orcamentos_produtos/agrupar_orcamentos` | Agrupar orçamentos de produtos |
| POST | `/orcamentos_servicos/agrupar_orcamentos` | Agrupar orçamentos de serviços |
| POST | `/etiquetas/gerar_etiquetas` | Gerar etiquetas de produto |
| POST | `/clientes/importar_cadastros` | Importar clientes via planilha |
| POST | `/fornecedores/importar_cadastros` | Importar fornecedores |
| POST | `/movimentacoes_financeiras/importar_cadastros` | Importar movimentações |
| POST | `/compras/importar_xml` | Importar XML de compra |
| GET  | `/compras/listar_notas_compras` | Listar notas de compra |
| POST | `/pedidos_arquivos/deletar` | Deletar arquivo anexado |
| GET  | `/assinatura/boleto` | Boleto de assinatura do plano |
| GET  | `/backup_dados/index` | Backup de dados |
| GET  | `/contabilidade/login` | Login no módulo contábil |

---

## 22. MAPA COMPLETO DE ROTAS (Extraído do Bundle JS)

> Extraído dos chunks JavaScript do frontend (299 rotas únicas identificadas).
> Padrão: `/{modulo}/{acao}` — onde `index` = listagem, `adicionar` = criar, etc.

### Atendimentos / Suporte
```
/assuntos_atendimentos/adicionar
/assuntos_atendimentos/index
/atendimentos/adicionar
/atendimentos/index
/formas_atendimentos/adicionar
/formas_atendimentos/index
/atributos_atendimentos/adicionar
/atributos_atendimentos/index
```

### Cadastros
```
/clientes/adicionar
/clientes/index
/clientes/importar_cadastros
/fornecedores/adicionar
/fornecedores/index
/fornecedores/importar_cadastros
/funcionarios/adicionar
/funcionarios/index
/transportadoras/adicionar
/transportadoras/index
/atributos_clientes/adicionar
/atributos_clientes/index
```

### Produtos / Estoque
```
/produtos/adicionar
/produtos/index
/grupos_produtos/adicionar
/grupos_produtos/index
/grades/adicionar
/grades/index
/ajustes_estoques/adicionar
/ajustes_estoques/index
/etiquetas/adicionar
/etiquetas/index
/etiquetas/gerar_etiquetas
/ncm/adicionar
/ncm/index
/ncm/pesquisa_ncm
/atributos_produtos/adicionar
/atributos_produtos/index
/atividades_servicos/adicionar
/atividades_servicos/index
```

### Compras / Cotações
```
/compras/adicionar
/compras/index
/compras/importar_xml
/compras/listar_notas_compras
/compras_servicos/adicionar
/compras_servicos/index
/cotacoes/adicionar
/cotacoes/index
/atributos_compras/adicionar
/atributos_compras/index
```

### Orçamentos
```
/orcamentos_produtos/adicionar
/orcamentos_produtos/index
/orcamentos_produtos/agrupar_orcamentos
/orcamentos_servicos/adicionar
/orcamentos_servicos/index
/orcamentos_servicos/agrupar_orcamentos
/atributos_orcamentos/adicionar
/atributos_orcamentos/index
```

### Ordens de Serviço
```
/ordens_servicos/adicionar
/ordens_servicos/index
/atributos_ordens_servicos/adicionar
/atributos_ordens_servicos/index
```

### Contratos
```
/contratos_servicos/adicionar
/contratos_servicos/index
/atributos_contratos/adicionar
/atributos_contratos/index
```

### Vendas / PDV
```
/caixas/abrir_caixa
/caixas/index
/devolucoes/adicionar
/devolucoes/index
/atributos_vendas/adicionar
/atributos_vendas/index
```

### Financeiro
```
/movimentacoes_financeiras/index
/movimentacoes_financeiras/index_recebimento
/movimentacoes_financeiras/index_pagamento
/movimentacoes_financeiras/index_conta_fixa
/movimentacoes_financeiras/adicionar_recebimento
/movimentacoes_financeiras/adicionar_pagamento
/movimentacoes_financeiras/agrupar_pagamento
/movimentacoes_financeiras/agrupar_recebimento
/movimentacoes_financeiras/boletos_bancarios
/movimentacoes_financeiras/dre_gerencial
/movimentacoes_financeiras/exportar_remessa
/movimentacoes_financeiras/fluxo_caixa
/movimentacoes_financeiras/importar_cadastros
/movimentacoes_financeiras/importar_extrato
/movimentacoes_financeiras/importar_retorno
/movimentacoes_financeiras/imprimir_boletos
/movimentacoes_financeiras/transferencia_contas
/contas_bancarias/adicionar
/contas_bancarias/index
/formas_pagamentos/adicionar
/formas_pagamentos/index
/categorias_movimentacoes_financeiras/adicionar
/categorias_movimentacoes_financeiras/index
/centros_custos/adicionar
/centros_custos/index
/atributos_movimentacoes_financeiras/adicionar
/atributos_movimentacoes_financeiras/index
/naturezas_operacoes/adicionar
/naturezas_operacoes/index
```

### Notas Fiscais
```
/notas_fiscais/adicionar
/notas_fiscais/index
/notas_fiscais/configuracoes
/notas_fiscais/importar_xml
/notas_fiscais/listar_cartas_correcoes
/notas_fiscais/listar_inutilizacoes_numeracoes
/notas_fiscais_consumidores/index
/notas_fiscais_consumidores/listar_inutilizacoes_numeracoes
/notas_fiscais_compras/index
/notas_fiscais_compras/importar_xml
/notas_fiscais_servicos/index
```

### Relatórios
```
/relatorios_estoque/index
/relatorios_estoque/relatorio_compras
/relatorios_estoque/relatorio_cotacoes
/relatorios_estoque/relatorio_estoque_produtos
/relatorios_estoque/relatorio_inventario_estoque
/relatorios_estoque/relatorio_produtos_comprados
/relatorios_estoque/relatorio_servicos_contratados
/relatorios_financeiros/index
/relatorios_financeiros/relatorio_centros_custos
/relatorios_financeiros/relatorio_comissao_vendedores
/relatorios_financeiros/relatorio_contas_bancarias
/relatorios_financeiros/relatorio_contas_pagar
/relatorios_financeiros/relatorio_contas_receber
/relatorios_financeiros/relatorio_controle_cheques
/relatorios_financeiros/relatorio_dre
/relatorios_financeiros/relatorio_extrato
/relatorios_notas_fiscais/index
/relatorios_notas_fiscais/relatorio_nfce
/relatorios_notas_fiscais/relatorio_nfe
/relatorios_notas_fiscais/relatorio_nfse
/relatorios_ordens_servicos/index
/relatorios_ordens_servicos/relatorio_comissao_tecnicos
```

### Configurações
```
/configuracoes/gerais
/configuracoes/dados_empresa
/configuracoes/marca_empresa
/configuracoes/certificado_digital
/grupos_usuarios/adicionar
/grupos_usuarios/index
/avisos/adicionar
/avisos/index
/balancas/adicionar
/balancas/index
/backup_dados/index
/atualizacoes/index
/dominios/configurar
/dominios/dados
/empresas/questionario
```

### Outros Módulos
```
/agenda/agendamentos
/ajuda/index
/ajuda/videos_tutoriais
/assinatura/boleto
/contabilidade/login
/dashboard/index
/integracoes/index
/planos/meu_plano
```

---

## 23. CAMPOS DE FORMULÁRIO POR MÓDULO

### Produto (`/produtos/adicionar`)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `nome` | text | Nome do produto (obrigatório) |
| `codigo` | text | Código interno |
| `codigo_barra` | text | Código de barras (EAN) |
| `grupo` | autocomplete | Grupo do produto → `/grupos_produtos/buscaGrupos` |
| `movimenta_estoque` | select | Sim/Não |
| `possui_nf` | select | Habilitar nota fiscal |
| `possui_variacao` | select | Possui variações (cor, tamanho) |
| `possui_composicao` | select | Produto composto (kit) |
| `unidade_entrada_id` | autocomplete | Unidade de entrada |
| `quantidade_saida` | number | Quantidade de saída por unidade entrada |
| `unidade_saida_id` | autocomplete | Unidade de saída |
| `peso` | decimal | Peso (kg) |
| `largura` | decimal | Largura (m) |
| `altura` | decimal | Altura (m) |
| `comprimento` | decimal | Comprimento (m) |
| `comissao` | decimal | Comissão (%) |
| `valor_custo_medio` | decimal | Custo médio |
| `valor_despesas_acessorias` | decimal | Despesas acessórias |
| `valor_outras_despesas` | decimal | Outras despesas |
| `valor_custo` | decimal | Custo final |
| `ncm` | autocomplete | NCM → `/ncm/buscaNcm?referencia=&q=` |
| `cest2` | autocomplete | CEST → `/cest/buscaCest?q=` |
| `cBenef` | text | Código benefício fiscal |
| `pesoL2` | decimal | Peso líquido (fiscal) |
| `pesoB2` | decimal | Peso bruto (fiscal) |
| `nFCI_Opc` | text | Número FCI |

### Orçamento Produtos (`/orcamentos_produtos/adicionar`)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `numero` | text | Número do orçamento |
| `cliente_id` | autocomplete | Cliente → `/clientes/buscaClientes` |
| `vendedor_id` | autocomplete | Vendedor/Responsável |
| `data` | date | Data do orçamento |
| `prazo_entrega` | text | Prazo de entrega |
| `aos_cuidados` | text | Destinatário |
| `validade` | date | Validade do orçamento |
| `canal_venda` | select | Canal de venda |
| `centro_custo_id` | autocomplete | Centro de custo |

### Ordem de Serviço (`/ordens_servicos/adicionar`)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `numero` | text | Número da OS |
| `cliente_id` | autocomplete | Cliente → `/clientes/buscaClientes` |
| `situacao` | select | Situação da OS |
| `entrada` | datetime | Data/hora de entrada |
| `saida` | datetime | Data/hora de saída prevista |
| `canal_venda` | select | Canal de venda |
| `centro_custo_id` | autocomplete | Centro de custo |
| `prioridade` | select | Prioridade |
| `vendedor_id` | autocomplete | Vendedor/Responsável |
| `tecnico_id` | autocomplete | Técnico responsável |
| `equipamento` | text | Equipamento |
| `marca` | text | Marca |
| `modelo` | text | Modelo |
| `serie` | text | Número de série |
| `condicoes` | textarea | Condições do equipamento |
| `defeitos` | textarea | Defeitos relatados |
| `acessorios` | textarea | Acessórios entregues |
| `solucao` | textarea | Solução aplicada |
| `laudo` | textarea | Laudo técnico |
| `termos` | textarea | Termos e condições |

### Compra (`/compras/adicionar`)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `numero` | text | Número da compra |
| `fornecedor_id` | autocomplete | Fornecedor → `/fornecedores/buscaFornecedores` |
| `data_emissao` | date | Data de emissão |
| `situacao` | select | Situação |
| `centro_custo_id` | autocomplete | Centro de custo |
| `numero_nfe` | text | Número da NF-e vinculada |

### Contrato de Serviço (`/contratos_servicos/adicionar`)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `numero` | text | Número do contrato |
| `cliente_id` | autocomplete | Cliente → `/clientes/buscaClientes` |
| `periodo_inicio` | date | Início do contrato |
| `periodo_fim` | date | Fim do contrato |
| `vendedor_id` | autocomplete | Vendedor |
| `canal_venda` | select | Canal de venda |
| `situacao` | select | Situação |
| `centro_custo_id` | autocomplete | Centro de custo |
| `tipo_parcela` | select | Tipo de parcela |
| `forma_pagamento_id` | autocomplete | Forma de pagamento |
| `intervalo` | number | Intervalo em dias |
| `qnt_parcelas` | number | Quantidade de parcelas |
| `data_primeira_parcela` | date | Data da 1ª parcela |

### Movimentação Financeira (`/movimentacoes_financeiras/adicionar_recebimento`)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `tipo` | select | Recebimento/Pagamento |
| `cliente_id` | autocomplete | Cliente/Fornecedor |
| `categoria_id` | autocomplete | Categoria → `/categorias_movimentacoes_financeiras/buscaCategorias` |
| `centro_custo_id` | autocomplete | Centro de custo |
| `forma_pagamento_id` | autocomplete | Forma de pagamento → `/formas_pagamentos/buscaFormasPagamentos/` |
| `conta_bancaria_id` | autocomplete | Conta bancária → `/contas_bancarias/buscaContasBancarias` |
| `valor` | decimal | Valor |
| `data_vencimento` | date | Data de vencimento |
| `data_competencia` | date | Data de competência |
| `descricao` | text | Descrição |
| `observacoes` | textarea | Observações |
