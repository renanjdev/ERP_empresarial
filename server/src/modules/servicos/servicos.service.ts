import { prisma } from '../../shared/utils/prisma.js'
import { buildPaginatedQuery, paginationMeta } from '../../shared/utils/crud.js'
import { PaginationParams } from '../../shared/utils/pagination.js'
import { formatMoney, parseMoney } from '../../shared/utils/money.js'
import { CreateServicoInput, UpdateServicoInput } from './servicos.schema.js'

function serializeServico(s: any) {
  return {
    ...s,
    id: s.id.toString(),
    empresa_id: s.empresa_id.toString(),
    valor: formatMoney(s.valor),
  }
}

export async function listServicos(params: PaginationParams, empresaId: bigint) {
  const { where, skip, take, orderBy } = buildPaginatedQuery(params, empresaId, ['nome'])
  const [items, total] = await Promise.all([
    prisma.servico.findMany({ where, skip, take, orderBy }),
    prisma.servico.count({ where }),
  ])
  return {
    items: items.map(serializeServico),
    meta: paginationMeta(total, params.page, params.per_page),
  }
}

export async function getServico(id: bigint, empresaId: bigint) {
  const servico = await prisma.servico.findFirst({ where: { id, empresa_id: empresaId, ativo: true } })
  if (!servico) return null
  return serializeServico(servico)
}

export async function createServico(data: CreateServicoInput, empresaId: bigint) {
  const { valor, ...rest } = data
  const servico = await prisma.servico.create({
    data: {
      ...rest,
      empresa_id: empresaId,
      valor: parseMoney(valor ?? '0,00'),
    },
  })
  return serializeServico(servico)
}

export async function updateServico(id: bigint, data: UpdateServicoInput, empresaId: bigint) {
  const exists = await prisma.servico.findFirst({ where: { id, empresa_id: empresaId, ativo: true } })
  if (!exists) return null

  const { valor, ...rest } = data
  const updateData: any = { ...rest, updated_at: new Date() }
  if (valor !== undefined) updateData.valor = parseMoney(valor)

  const servico = await prisma.servico.update({ where: { id }, data: updateData })
  return serializeServico(servico)
}

export async function deleteServico(id: bigint, empresaId: bigint) {
  const exists = await prisma.servico.findFirst({ where: { id, empresa_id: empresaId, ativo: true } })
  if (!exists) return false
  await prisma.servico.update({ where: { id }, data: { ativo: false } })
  return true
}
