import { prisma } from '../../shared/utils/prisma.js'
import { buildPaginatedQuery, paginationMeta } from '../../shared/utils/crud.js'
import { PaginationParams } from '../../shared/utils/pagination.js'
import { CreateFormaPagamentoInput, UpdateFormaPagamentoInput } from './formas_pagamentos.schema.js'

function serializeFormaPagamento(f: any) {
  return {
    ...f,
    id: f.id.toString(),
    empresa_id: f.empresa_id.toString(),
  }
}

export async function listFormasPagamentos(params: PaginationParams, empresaId: bigint) {
  const { where, skip, take, orderBy } = buildPaginatedQuery(params, empresaId, ['nome'])
  const [items, total] = await Promise.all([
    prisma.formaPagamento.findMany({ where, skip, take, orderBy }),
    prisma.formaPagamento.count({ where }),
  ])
  return {
    items: items.map(serializeFormaPagamento),
    meta: paginationMeta(total, params.page, params.per_page),
  }
}

export async function getFormaPagamento(id: bigint, empresaId: bigint) {
  const forma = await prisma.formaPagamento.findFirst({ where: { id, empresa_id: empresaId, ativo: true } })
  if (!forma) return null
  return serializeFormaPagamento(forma)
}

export async function createFormaPagamento(data: CreateFormaPagamentoInput, empresaId: bigint) {
  const forma = await prisma.formaPagamento.create({
    data: { ...data, empresa_id: empresaId },
  })
  return serializeFormaPagamento(forma)
}

export async function updateFormaPagamento(id: bigint, data: UpdateFormaPagamentoInput, empresaId: bigint) {
  const exists = await prisma.formaPagamento.findFirst({ where: { id, empresa_id: empresaId, ativo: true } })
  if (!exists) return null
  const forma = await prisma.formaPagamento.update({ where: { id }, data })
  return serializeFormaPagamento(forma)
}

export async function deleteFormaPagamento(id: bigint, empresaId: bigint) {
  const exists = await prisma.formaPagamento.findFirst({ where: { id, empresa_id: empresaId, ativo: true } })
  if (!exists) return false
  await prisma.formaPagamento.update({ where: { id }, data: { ativo: false } })
  return true
}
