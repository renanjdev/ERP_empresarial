import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const empresa = await prisma.empresa.create({
    data: {
      razao_social: 'Empresa Teste LTDA',
      nome_fantasia: 'Empresa Teste',
      cnpj: '12.345.678/0001-90',
      email: 'contato@empresateste.com.br',
      telefone: '(11) 3000-0000',
    },
  })

  const grupo = await prisma.grupoUsuario.create({
    data: { empresa_id: empresa.id, nome: 'Administrador' },
  })

  const modulos = ['clientes', 'fornecedores', 'produtos', 'servicos', 'formas_pagamentos', 'categorias', 'centros_custos', 'usuarios']
  const acoes = ['visualizar', 'cadastrar', 'editar', 'excluir']
  for (const modulo of modulos) {
    for (const acao of acoes) {
      await prisma.permissao.create({
        data: { empresa_id: empresa.id, grupo_usuario_id: grupo.id, modulo, acao, permitido: true },
      })
    }
  }

  const senhaHash = await bcrypt.hash('123456', 10)
  await prisma.usuario.create({
    data: { empresa_id: empresa.id, grupo_usuario_id: grupo.id, nome: 'Administrador', email: 'admin@teste.com', senha_hash: senhaHash },
  })

  const clientesData = [
    { nome: 'Joao Silva', cpf_cnpj: '123.456.789-00', tipo_pessoa: 'F', email: 'joao@email.com', telefone: '(11) 9999-0001' },
    { nome: 'Maria Santos', cpf_cnpj: '987.654.321-00', tipo_pessoa: 'F', email: 'maria@email.com', telefone: '(11) 9999-0002' },
    { nome: 'Tech Solutions LTDA', cpf_cnpj: '11.222.333/0001-44', tipo_pessoa: 'J', email: 'contato@techsolutions.com', telefone: '(11) 3333-0001' },
    { nome: 'Pedro Oliveira', cpf_cnpj: '111.222.333-44', tipo_pessoa: 'F', email: 'pedro@email.com', telefone: '(11) 9999-0003' },
    { nome: 'Comercial ABC LTDA', cpf_cnpj: '55.666.777/0001-88', tipo_pessoa: 'J', email: 'abc@comercial.com', telefone: '(11) 3333-0002' },
  ]
  for (const c of clientesData) {
    await prisma.cliente.create({ data: { empresa_id: empresa.id, ...c } })
  }

  const fornecedoresData = [
    { razao_social: 'Distribuidora Nacional LTDA', nome_fantasia: 'DistriNac', cnpj: '22.333.444/0001-55', email: 'vendas@distrinac.com', telefone: '(11) 4444-0001' },
    { razao_social: 'Industria ABC S.A.', nome_fantasia: 'ABC', cnpj: '33.444.555/0001-66', email: 'compras@abc.com', telefone: '(11) 4444-0002' },
    { razao_social: 'Importadora Global LTDA', nome_fantasia: 'Global', cnpj: '44.555.666/0001-77', email: 'global@imp.com', telefone: '(11) 4444-0003' },
  ]
  for (const f of fornecedoresData) {
    await prisma.fornecedor.create({ data: { empresa_id: empresa.id, ...f } })
  }

  const grupoEletronicos = await prisma.grupoProduto.create({ data: { empresa_id: empresa.id, nome: 'Eletronicos' } })
  const grupoAcessorios = await prisma.grupoProduto.create({ data: { empresa_id: empresa.id, nome: 'Acessorios' } })
  const grupoInformatica = await prisma.grupoProduto.create({ data: { empresa_id: empresa.id, nome: 'Informatica' } })

  const unidadeUn = await prisma.unidade.create({ data: { empresa_id: empresa.id, nome: 'Unidade', sigla: 'UN' } })

  const produtosData = [
    { nome: 'Notebook Dell Inspiron', sku: 'NB-DELL-001', valor_venda: 4599.90, valor_custo: 3200.00, unidade_id: unidadeUn.id, grupo_id: grupoEletronicos.id },
    { nome: 'Mouse Logitech MX Master', sku: 'MS-LOG-001', valor_venda: 599.90, valor_custo: 350.00, unidade_id: unidadeUn.id, grupo_id: grupoAcessorios.id },
    { nome: 'Teclado Mecanico Redragon', sku: 'TC-RED-001', valor_venda: 299.90, valor_custo: 150.00, unidade_id: unidadeUn.id, grupo_id: grupoAcessorios.id },
    { nome: 'Monitor LG 27 4K', sku: 'MN-LG-001', valor_venda: 2899.90, valor_custo: 1800.00, unidade_id: unidadeUn.id, grupo_id: grupoEletronicos.id },
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

  const catReceitas = await prisma.categoriaFinanceira.create({ data: { empresa_id: empresa.id, nome: 'Receitas', tipo: 'receita' } })
  await prisma.categoriaFinanceira.create({ data: { empresa_id: empresa.id, nome: 'Vendas de Produtos', tipo: 'receita', pai_id: catReceitas.id } })
  await prisma.categoriaFinanceira.create({ data: { empresa_id: empresa.id, nome: 'Vendas de Servicos', tipo: 'receita', pai_id: catReceitas.id } })

  const catDespesas = await prisma.categoriaFinanceira.create({ data: { empresa_id: empresa.id, nome: 'Despesas', tipo: 'despesa' } })
  await prisma.categoriaFinanceira.create({ data: { empresa_id: empresa.id, nome: 'Salarios', tipo: 'despesa', pai_id: catDespesas.id } })
  await prisma.categoriaFinanceira.create({ data: { empresa_id: empresa.id, nome: 'Aluguel', tipo: 'despesa', pai_id: catDespesas.id } })
  await prisma.categoriaFinanceira.create({ data: { empresa_id: empresa.id, nome: 'Fornecedores', tipo: 'despesa', pai_id: catDespesas.id } })

  await prisma.centroCusto.create({ data: { empresa_id: empresa.id, nome: 'Administrativo', descricao: 'Custos administrativos gerais' } })
  await prisma.centroCusto.create({ data: { empresa_id: empresa.id, nome: 'Comercial', descricao: 'Custos do setor comercial' } })
  await prisma.centroCusto.create({ data: { empresa_id: empresa.id, nome: 'Operacional', descricao: 'Custos operacionais' } })

  console.log('Seed concluido com sucesso!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
