import { prisma } from '../../shared/utils/prisma.js'
import { buildPaginatedQuery, paginationMeta } from '../../shared/utils/crud.js'
import { PaginationParams } from '../../shared/utils/pagination.js'
import { CreateCategoriaInput, UpdateCategoriaInput } from './categorias.schema.js'

function serializeCategoria(c: any): any {
  return {
    ...c,
    id: c.id.toString(),
    empresa_id: c.empresa_id.toString(),
    pai_id: c.pai_id?.toString() ?? null,
    pai: c.pai ? serializeCategoria(c.pai) : undefined,
    filhas: c.filhas?.map((f: any) => serializeCategoria(f)),
  }
}

export async function listCategorias(params: PaginationParams, empresaId: bigint) {
  const { where, skip, take, orderBy } = buildPaginatedQuery(params, empresaId, ['nome'])
  // Return tree: only top-level categories (no pai_id), with nested filhas
  const treeWhere = { ...where, pai_id: null }
  const [items, total] = await Promise.all([
    prisma.categoriaFinanceira.findMany({
      where: treeWhere,
      skip,
      take,
      orderBy,
      include: {
        filhas: {
          where: { ativo: true },
          include: {
            filhas: {
              where: { ativo: true },
            },
          },
        },
      },
    }),
    prisma.categoriaFinanceira.count({ where: treeWhere }),
  ])
  return {
    items: items.map(serializeCategoria),
    meta: paginationMeta(total, params.page, params.per_page),
  }
}

export async function getCategoria(id: bigint, empresaId: bigint) {
  const categoria = await prisma.categoriaFinanceira.findFirst({
    where: { id, empresa_id: empresaId, ativo: true },
    include: {
      pai: true,
      filhas: { where: { ativo: true } },
    },
  })
  if (!categoria) return null
  return serializeCategoria(categoria)
}

export async function createCategoria(data: CreateCategoriaInput, empresaId: bigint) {
  const categoria = await prisma.categoriaFinanceira.create({
    data: { ...data, empresa_id: empresaId },
    include: { pai: true, filhas: true },
  })
  return serializeCategoria(categoria)
}

export async function updateCategoria(id: bigint, data: UpdateCategoriaInput, empresaId: bigint) {
  const exists = await prisma.categoriaFinanceira.findFirst({ where: { id, empresa_id: empresaId, ativo: true } })
  if (!exists) return null
  const categoria = await prisma.categoriaFinanceira.update({
    where: { id },
    data,
    include: { pai: true, filhas: { where: { ativo: true } } },
  })
  return serializeCategoria(categoria)
}

export async function deleteCategoria(id: bigint, empresaId: bigint) {
  const exists = await prisma.categoriaFinanceira.findFirst({ where: { id, empresa_id: empresaId, ativo: true } })
  if (!exists) return false
  await prisma.categoriaFinanceira.update({ where: { id }, data: { ativo: false } })
  return true
}
