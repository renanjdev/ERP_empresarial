import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email invalido'),
  senha: z.string().min(1, 'Senha obrigatoria'),
})

export const recuperarSenhaSchema = z.object({
  email: z.string().email('Email invalido'),
})

export const redefinirSenhaSchema = z.object({
  token: z.string().min(1),
  nova_senha: z.string().min(6, 'Senha deve ter no minimo 6 caracteres'),
})
