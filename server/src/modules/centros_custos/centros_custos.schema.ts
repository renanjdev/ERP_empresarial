import { z } from 'zod'

export const createCentroCustoSchema = z.object({
  nome: z.string().min(1),
  descricao: z.string().optional(),
})

export const updateCentroCustoSchema = createCentroCustoSchema.partial()

export type CreateCentroCustoInput = z.infer<typeof createCentroCustoSchema>
export type UpdateCentroCustoInput = z.infer<typeof updateCentroCustoSchema>
