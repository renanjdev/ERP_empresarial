import { prisma } from '../../shared/utils/prisma.js'
import { buildPaginatedQuery, paginationMeta } from '../../shared/utils/crud.js'
import { PaginationParams } from '../../shared/utils/pagination.js'
import { CreateCentroCustoInput, UpdateCentroCustoInput } from './centros_custos.schema.js'

function serializeCentroCusto(c: any) {
  return {
    ...c,
    id: c.id.toString(),
    empresa_id: c.empresa_id.toString(),
  }
}

export async function listCentrosCustos(params: PaginationParams, empresaId: bigint) {
  const { where, skip, take, orderBy } = buildPaginatedQuery(params, empresaId, ['nome'])
  const [items, total] = await Promise.all([
    prisma.centroCusto.findMany({ where, skip, take, orderBy }),
    prisma.centroCusto.count({ where }),
  ])
  return {
    items: items.map(serializeCentroCusto),
    meta: paginationMeta(total, params.page, params.per_page),
  }
}

export async function getCentroCusto(id: bigint, empresaId: bigint) {
  const centro = await prisma.centroCusto.findFirst({ where: { id, empresa_id: empresaId, ativo: true } })
  if (!centro) return null
  return serializeCentroCusto(centro)
}

export async function createCentroCusto(data: CreateCentroCustoInput, empresaId: bigint) {
  const centro = await prisma.centroCusto.create({
    data: { ...data, empresa_id: empresaId },
  })
  return serializeCentroCusto(centro)
}

export async function updateCentroCusto(id: bigint, data: UpdateCentroCustoInput, empresaId: bigint) {
  const exists = await prisma.centroCusto.findFirst({ where: { id, empresa_id: empresaId, ativo: true } })
  if (!exists) return null
  const centro = await prisma.centroCusto.update({ where: { id }, data })
  return serializeCentroCusto(centro)
}

export async function deleteCentroCusto(id: bigint, empresaId: bigint) {
  const exists = await prisma.centroCusto.findFirst({ where: { id, empresa_id: empresaId, ativo: true } })
  if (!exists) return false
  await prisma.centroCusto.update({ where: { id }, data: { ativo: false } })
  return true
}
