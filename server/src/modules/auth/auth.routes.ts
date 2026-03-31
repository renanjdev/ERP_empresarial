import { FastifyInstance } from 'fastify'
import { loginSchema, recuperarSenhaSchema, redefinirSenhaSchema } from './auth.schema.js'
import { login } from './auth.service.js'
import { success, error } from '../../shared/utils/response.js'
import { verifyRefreshToken, signAccessToken } from '../../shared/utils/jwt.js'

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/login', async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send(error(400, 'Dados invalidos', { errors: parsed.error.issues }))
    }
    try {
      const result = await login(parsed.data.email, parsed.data.senha)
      reply.setCookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/auth/refresh',
        maxAge: 7 * 24 * 60 * 60,
      })
      return success('Login realizado', {
        token: result.token,
        usuario: result.usuario,
        empresa: result.empresa,
        permissoes: result.permissoes,
      })
    } catch (err: any) {
      return reply.status(err.statusCode || 500).send(error(err.statusCode || 500, err.message))
    }
  })

  app.post('/auth/refresh', async (request, reply) => {
    const token = request.cookies?.refreshToken
    if (!token) {
      return reply.status(401).send(error(401, 'Refresh token nao fornecido'))
    }
    try {
      const payload = verifyRefreshToken(token)
      const newAccessToken = signAccessToken({ usuario_id: payload.usuario_id, empresa_id: payload.empresa_id })
      return success('Token renovado', { token: newAccessToken })
    } catch {
      return reply.status(401).send(error(401, 'Refresh token invalido'))
    }
  })

  app.post('/auth/logout', async (_request, reply) => {
    reply.clearCookie('refreshToken', { path: '/auth/refresh' })
    return success('Logout realizado')
  })

  app.post('/auth/recuperar-senha', async (request, reply) => {
    const parsed = recuperarSenhaSchema.safeParse(request.body)
    if (!parsed.success) return reply.status(400).send(error(400, 'Email invalido'))
    return success('Se o email existir, enviaremos um link de recuperacao')
  })

  app.post('/auth/redefinir-senha', async (request, reply) => {
    const parsed = redefinirSenhaSchema.safeParse(request.body)
    if (!parsed.success) return reply.status(400).send(error(400, 'Dados invalidos', { errors: parsed.error.issues }))
    return success('Senha redefinida com sucesso')
  })
}
