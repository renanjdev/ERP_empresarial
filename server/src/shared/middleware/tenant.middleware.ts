import { FastifyRequest, FastifyReply } from 'fastify'

export async function tenantMiddleware(request: FastifyRequest, reply: FastifyReply) {
  if (!request.empresa_id) {
    return reply.status(401).send({ code: 401, status: 'error', message: 'Empresa nao identificada' })
  }
}
