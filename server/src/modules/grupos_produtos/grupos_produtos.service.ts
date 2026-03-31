import { prisma } from '../../shared/utils/prisma.js'
import { paginationMeta } from '../../shared/utils/crud.js'
import { PaginationParams } from '../../shared/utils/pagination.js'
import { CreateGrupoProdutoInput, UpdateGrupoProdutoInput } from './grupos_produtos.schema.js'

function serializeGrupoProduto(g: any) {
  return {
    ...g,
    id: g.id.toString(),
    empresa_id: g.empresa_id.toString(),
  }
}

export async function listGruposProdutos(params: PaginationParams, empresaId: bigint) {
  const where: any = { empresa_id: empresaId }
  if (params.q) {
    where.nome = { contains: params.q, mode: 'insensitive' }
  }
  const skip = (params.page - 1) * params.per_page
  const take = params.per_page
  const orderBy = params.sort_by ? { [params.sort_by]: params.sort_order } : { created_at: 'desc' as const }

  const [items, total] = await Promise.all([
    prisma.grupoProduto.findMany({ where, skip, take, orderBy }),
    prisma.grupoProduto.count({ where }),
  ])
  return {
    items: items.map(serializeGrupoProduto),
    meta: paginationMeta(total, params.page, params.per_page),
  }
}

export async function getGrupoProduto(id: bigint, empresaId: bigint) {
  const grupo = await prisma.grupoProduto.findFirst({ where: { id, empresa_id: empresaId } })
  if (!grupo) return null
  return serializeGrupoProduto(grupo)
}

export async function createGrupoProduto(data: CreateGrupoProdutoInput, empresaId: bigint) {
  const grupo = await prisma.grupoProduto.create({
    data: { ...data, empresa_id: empresaId },
  })
  return serializeGrupoProduto(grupo)
}

export async function updateGrupoProduto(id: bigint, data: UpdateGrupoProdutoInput, empresaId: bigint) {
  const exists = await prisma.grupoProduto.findFirst({ where: { id, empresa_id: empresaId } })
  if (!exists) return null
  const grupo = await prisma.grupoProduto.update({ where: { id }, data })
  return serializeGrupoProduto(grupo)
}

export async function deleteGrupoProduto(id: bigint, empresaId: bigint) {
  const exists = await prisma.grupoProduto.findFirst({ where: { id, empresa_id: empresaId } })
  if (!exists) return false
  await prisma.grupoProduto.delete({ where: { id } })
  return true
}

export async function autocompleteGruposProdutos(q: string, empresaId: bigint) {
  const items = await prisma.grupoProduto.findMany({
    where: {
      empresa_id: empresaId,
      nome: { contains: q, mode: 'insensitive' },
    },
    select: { id: true, nome: true },
    take: 20,
  })
  return items.map(i => ({ ...i, id: i.id.toString() }))
}
