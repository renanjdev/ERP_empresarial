import { PaginationParams, paginationMeta } from './pagination.js'

export function buildPaginatedQuery(params: PaginationParams, empresaId: bigint, searchFields: string[] = []) {
  const where: any = { empresa_id: empresaId, ativo: true }
  if (params.q && searchFields.length > 0) {
    where.OR = searchFields.map(field => ({
      [field]: { contains: params.q, mode: 'insensitive' },
    }))
  }
  const skip = (params.page - 1) * params.per_page
  const take = params.per_page
  const orderBy = params.sort_by ? { [params.sort_by]: params.sort_order } : { created_at: 'desc' as const }
  return { where, skip, take, orderBy }
}

export { paginationMeta }
