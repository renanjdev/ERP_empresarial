import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../utils/prisma.js'

export function permissoesMiddleware(modulo: string, acao: string) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const usuario = await prisma.usuario.findFirst({
      where: { id: request.usuario_id, empresa_id: request.empresa_id },
      include: { grupo_usuario: { include: { permissoes: true } } },
    })
    if (!usuario?.grupo_usuario) {
      return reply.status(403).send({ code: 403, status: 'error', message: 'Sem grupo de permissoes' })
    }
    const permissao = usuario.grupo_usuario.permissoes.find(
      p => p.modulo === modulo && p.acao === acao && p.permitido
    )
    if (!permissao) {
      return reply.status(403).send({ code: 403, status: 'error', message: 'Sem permissao para esta acao' })
    }
  }
}
