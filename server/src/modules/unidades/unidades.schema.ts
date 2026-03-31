import { z } from 'zod'

export const createUnidadeSchema = z.object({
  nome: z.string().min(1),
  sigla: z.string().min(1),
})

export const updateUnidadeSchema = createUnidadeSchema.partial()

export type CreateUnidadeInput = z.infer<typeof createUnidadeSchema>
export type UpdateUnidadeInput = z.infer<typeof updateUnidadeSchema>
