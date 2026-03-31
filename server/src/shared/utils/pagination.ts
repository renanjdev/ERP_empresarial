import { z } from 'zod'

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  per_page: z.coerce.number().min(1).max(100).default(20),
  sort_by: z.string().optional(),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
  q: z.string().optional(),
})

export type PaginationParams = z.infer<typeof paginationSchema>

export function paginationMeta(total: number, page: number, perPage: number) {
  return { total, page, per_page: perPage, total_pages: Math.ceil(total / perPage) }
}
