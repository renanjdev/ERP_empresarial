import { z } from 'zod'

export const createServicoSchema = z.object({
  nome: z.string().min(1),
  valor: z.string().optional().default('0,00'),
  descricao: z.string().optional(),
})

export const updateServicoSchema = createServicoSchema.partial()

export type CreateServicoInput = z.infer<typeof createServicoSchema>
export type UpdateServicoInput = z.infer<typeof updateServicoSchema>
