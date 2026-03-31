import { z } from 'zod'

export const updateEmpresaSchema = z.object({
  razao_social: z.string().min(1).optional(),
  nome_fantasia: z.string().optional(),
  email: z.string().optional(),
  telefone: z.string().optional(),
})

export type UpdateEmpresaInput = z.infer<typeof updateEmpresaSchema>
