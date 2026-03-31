import { prisma } from '../../shared/utils/prisma.js'
import { buildPaginatedQuery, paginationMeta } from '../../shared/utils/crud.js'
import { PaginationParams } from '../../shared/utils/pagination.js'
import { formatMoney, parseMoney } from '../../shared/utils/money.js'
import { CreateProdutoInput, UpdateProdutoInput } from './produtos.schema.js'

function serializeProduto(p: any) {
  return {
    ...p,
    id: p.id.toString(),
    empresa_id: p.empresa_id.toString(),
    unidade_id: p.unidade_id?.toString() ?? null,
    grupo_id: p.grupo_id?.toString() ?? null,
    valor_venda: formatMoney(p.valor_venda),
    valor_custo: formatMoney(p.valor_custo),
    unidade: p.unidade ? { ...p.unidade, id: p.unidade.id.toString(), empresa_id: p.unidade.empresa_id.toString() } : null,
    grupo: p.grupo ? { ...p.grupo, id: p.grupo.id.toString(), empresa_id: p.grupo.empresa_id.toString() } : null,
    lojas: p.lojas?.map((l: any) => ({
      ...l,
      id: l.id.toString(),
      produto_id: l.produto_id.toString(),
      empresa_id: l.empresa_id.toString(),
      estoque_atual: formatMoney(l.estoque_atual),
      estoque_minimo: formatMoney(l.estoque_minimo),
    })),
  }
}

export async function listProdutos(params: PaginationParams, empresaId: bigint) {
  const { where, skip, take, orderBy } = buildPaginatedQuery(params, empresaId, ['nome', 'sku'])
  const [items, total] = await Promise.all([
    prisma.produto.findMany({
      where, skip, take, orderBy,
      include: { unidade: true, grupo: true, lojas: true },
    }),
    prisma.produto.count({ where }),
  ])
  return {
    items: items.map(serializeProduto),
    meta: paginationMeta(total, params.page, params.per_page),
  }
}

export async function getProduto(id: bigint, empresaId: bigint) {
  const produto = await prisma.produto.findFirst({
    where: { id, empresa_id: empresaId, ativo: true },
    include: { unidade: true, grupo: true, lojas: true },
  })
  if (!produto) return null
  return serializeProduto(produto)
}

export async function createProduto(data: CreateProdutoInput, empresaId: bigint) {
  const { valor_venda, valor_custo, ...rest } = data
  const produto = await prisma.produto.create({
    data: {
      ...rest,
      empresa_id: empresaId,
      valor_venda: parseMoney(valor_venda ?? '0,00'),
      valor_custo: parseMoney(valor_custo ?? '0,00'),
    },
    include: { unidade: true, grupo: true, lojas: true },
  })
  return serializeProduto(produto)
}

export async function updateProduto(id: bigint, data: UpdateProdutoInput, empresaId: bigint) {
  const exists = await prisma.produto.findFirst({ where: { id, empresa_id: empresaId, ativo: true } })
  if (!exists) return null

  const { valor_venda, valor_custo, ...rest } = data
  const updateData: any = { ...rest, updated_at: new Date() }
  if (valor_venda !== undefined) updateData.valor_venda = parseMoney(valor_venda)
  if (valor_custo !== undefined) updateData.valor_custo = parseMoney(valor_custo)

  const produto = await prisma.produto.update({
    where: { id },
    data: updateData,
    include: { unidade: true, grupo: true, lojas: true },
  })
  return serializeProduto(produto)
}

export async function deleteProduto(id: bigint, empresaId: bigint) {
  const exists = await prisma.produto.findFirst({ where: { id, empresa_id: empresaId, ativo: true } })
  if (!exists) return false
  await prisma.produto.update({ where: { id }, data: { ativo: false } })
  return true
}

export async function autocompleteProdutos(q: string, empresaId: bigint) {
  const items = await prisma.produto.findMany({
    where: {
      empresa_id: empresaId,
      ativo: true,
      OR: [
        { nome: { contains: q, mode: 'insensitive' } },
        { sku: { contains: q, mode: 'insensitive' } },
      ],
    },
    select: { id: true, nome: true, sku: true, valor_venda: true },
    take: 20,
  })
  return items.map(i => ({ ...i, id: i.id.toString(), valor_venda: formatMoney(i.valor_venda) }))
}
