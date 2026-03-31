import { FastifyRequest, FastifyReply } from 'fastify'
import { verifyAccessToken } from '../utils/jwt.js'

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return reply.status(401).send({ code: 401, status: 'error', message: 'Token nao fornecido' })
  }
  try {
    const token = authHeader.slice(7)
    const payload = verifyAccessToken(token)
    request.usuario_id = BigInt(payload.usuario_id)
    request.empresa_id = BigInt(payload.empresa_id)
  } catch {
    return reply.status(401).send({ code: 401, status: 'error', message: 'Token invalido ou expirado' })
  }
}
