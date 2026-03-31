import { prisma } from '../../shared/utils/prisma.js'
import { paginationMeta } from '../../shared/utils/crud.js'
import { PaginationParams } from '../../shared/utils/pagination.js'
import { CreateUnidadeInput, UpdateUnidadeInput } from './unidades.schema.js'

function serializeUnidade(u: any) {
  return {
    ...u,
    id: u.id.toString(),
    empresa_id: u.empresa_id.toString(),
  }
}

export async function listUnidades(params: PaginationParams, empresaId: bigint) {
  const where: any = { empresa_id: empresaId }
  if (params.q) {
    where.OR = [
      { nome: { contains: params.q, mode: 'insensitive' } },
      { sigla: { contains: params.q, mode: 'insensitive' } },
    ]
  }
  const skip = (params.page - 1) * params.per_page
  const take = params.per_page
  const orderBy = params.sort_by ? { [params.sort_by]: params.sort_order } : { nome: 'asc' as const }

  const [items, total] = await Promise.all([
    prisma.unidade.findMany({ where, skip, take, orderBy }),
    prisma.unidade.count({ where }),
  ])
  return {
    items: items.map(serializeUnidade),
    meta: paginationMeta(total, params.page, params.per_page),
  }
}

export async function getUnidade(id: bigint, empresaId: bigint) {
  const unidade = await prisma.unidade.findFirst({ where: { id, empresa_id: empresaId } })
  if (!unidade) return null
  return serializeUnidade(unidade)
}

export async function createUnidade(data: CreateUnidadeInput, empresaId: bigint) {
  const unidade = await prisma.unidade.create({
    data: { ...data, empresa_id: empresaId },
  })
  return serializeUnidade(unidade)
}

export async function updateUnidade(id: bigint, data: UpdateUnidadeInput, empresaId: bigint) {
  const exists = await prisma.unidade.findFirst({ where: { id, empresa_id: empresaId } })
  if (!exists) return null
  const unidade = await prisma.unidade.update({ where: { id }, data })
  return serializeUnidade(unidade)
}

export async function deleteUnidade(id: bigint, empresaId: bigint) {
  const exists = await prisma.unidade.findFirst({ where: { id, empresa_id: empresaId } })
  if (!exists) return false
  await prisma.unidade.delete({ where: { id } })
  return true
}

export async function autocompleteUnidades(q: string, empresaId: bigint) {
  const items = await prisma.unidade.findMany({
    where: {
      empresa_id: empresaId,
      OR: [
        { nome: { contains: q, mode: 'insensitive' } },
        { sigla: { contains: q, mode: 'insensitive' } },
      ],
    },
    select: { id: true, nome: true, sigla: true },
    take: 20,
  })
  return items.map(i => ({ ...i, id: i.id.toString() }))
}
