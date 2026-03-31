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

export const createClienteSchema = z.object({
  nome: z.string().min(1),
  cpf_cnpj: z.string().optional(),
  tipo_pessoa: z.enum(['F', 'J']).default('F'),
  email: z.string().optional(),
  telefone: z.string().optional(),
  celular: z.string().optional(),
  observacoes: z.string().optional(),
  enderecos: z.array(enderecoSchema).optional().default([]),
  contatos: z.array(contatoSchema).optional().default([]),
})

export const updateClienteSchema = createClienteSchema.partial().extend({
  enderecos: z.array(enderecoSchema).optional(),
  contatos: z.array(contatoSchema).optional(),
})

export type CreateClienteInput = z.infer<typeof createClienteSchema>
export type UpdateClienteInput = z.infer<typeof updateClienteSchema>
