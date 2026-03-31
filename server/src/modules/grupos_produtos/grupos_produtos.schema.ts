import { z } from 'zod'

export const createGrupoProdutoSchema = z.object({
  nome: z.string().min(1),
})

export const updateGrupoProdutoSchema = createGrupoProdutoSchema.partial()

export type CreateGrupoProdutoInput = z.infer<typeof createGrupoProdutoSchema>
export type UpdateGrupoProdutoInput = z.infer<typeof updateGrupoProdutoSchema>
