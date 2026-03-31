import { z } from 'zod'

export const createProdutoSchema = z.object({
  nome: z.string().min(1),
  sku: z.string().optional(),
  valor_venda: z.string().optional().default('0,00'),
  valor_custo: z.string().optional().default('0,00'),
  unidade_id: z.coerce.bigint().optional(),
  grupo_id: z.coerce.bigint().optional(),
  descricao: z.string().optional(),
})

export const updateProdutoSchema = createProdutoSchema.partial()

export type CreateProdutoInput = z.infer<typeof createProdutoSchema>
export type UpdateProdutoInput = z.infer<typeof updateProdutoSchema>
