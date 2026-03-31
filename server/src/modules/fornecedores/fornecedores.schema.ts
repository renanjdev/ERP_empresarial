import { z } from 'zod'

const enderecoSchema = z.object({
  cep: z.string().optional(),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  uf: z.string().optional(),
})

const contatoSchema = z.object({
  nome: z.string().min(1),
  telefone: z.string().optional(),
  email: z.string().optional(),
  cargo: z.string().optional(),
})

export const createFornecedorSchema = z.object({
  razao_social: z.string().min(1),
  nome_fantasia: z.string().optional(),
  cnpj: z.string().optional(),
  email: z.string().optional(),
  telefone: z.string().optional(),
  observacoes: z.string().optional(),
  enderecos: z.array(enderecoSchema).optional().default([]),
  contatos: z.array(contatoSchema).optional().default([]),
})

export const updateFornecedorSchema = createFornecedorSchema.partial().extend({
  enderecos: z.array(enderecoSchema).optional(),
  contatos: z.array(contatoSchema).optional(),
})

export type CreateFornecedorInput = z.infer<typeof createFornecedorSchema>
export type UpdateFornecedorInput = z.infer<typeof updateFornecedorSchema>
