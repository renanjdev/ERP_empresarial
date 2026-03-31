import { z } from 'zod'

export const createFormaPagamentoSchema = z.object({
  nome: z.string().min(1),
  tipo: z.enum(['dinheiro', 'pix', 'cartao_credito', 'cartao_debito', 'boleto', 'cheque', 'outros']),
})

export const updateFormaPagamentoSchema = createFormaPagamentoSchema.partial()

export type CreateFormaPagamentoInput = z.infer<typeof createFormaPagamentoSchema>
export type UpdateFormaPagamentoInput = z.infer<typeof updateFormaPagamentoSchema>
