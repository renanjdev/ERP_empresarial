import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../../shared/middleware/auth.middleware.js'
import { permissoesMiddleware } from '../../shared/middleware/permissoes.middleware.js'
import { paginationSchema } from '../../shared/utils/pagination.js'
import { createServicoSchema, updateServicoSchema } from './servicos.schema.js'
import { listServicos, getServico, createServico, updateServico, deleteServico } from './servicos.service.js'
import { success, created, error } from '../../shared/utils/response.js'

export async function servicosRoutes(app: FastifyInstance) {
  app.get('/servicos', {
    preHandler: [authMiddleware, permissoesMiddleware('servicos', 'listar')],
    handler: async (request, reply) => {
      const parsed = paginationSchema.safeParse(request.query)
      if (!parsed.success) return reply.status(400).send(error(400, 'Parametros invalidos'))
      const result = await listServicos(parsed.data, request.empresa_id)
      return success('Servicos listados', result)
    },
  })

  app.get('/servicos/:id', {
    preHandler: [authMiddleware, permissoesMiddleware('servicos', 'visualizar')],
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      const servico = await getServico(BigInt(id), request.empresa_id)
      if (!servico) return reply.status(404).send(error(404, 'Servico nao encontrado'))
      return success('Servico encontrado', servico)
    },
  })

  app.post('/servicos', {
    preHandler: [authMiddleware, permissoesMiddleware('servicos', 'criar')],
    handler: async (request, reply) => {
      const parsed = createServicoSchema.safeParse(request.body)
      if (!parsed.success) return reply.status(400).send(error(400, 'Dados invalidos', { errors: parsed.error.issues }))
      const servico = await createServico(parsed.data, request.empresa_id)
      return reply.status(201).send(created('Servico criado', servico))
    },
  })

  app.put('/servicos/:id', {
    preHandler: [authMiddleware, permissoesMiddleware('servicos', 'editar')],
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      const parsed = updateServicoSchema.safeParse(request.body)
      if (!parsed.success) return reply.status(400).send(error(400, 'Dados invalidos', { errors: parsed.error.issues }))
      const servico = await updateServico(BigInt(id), parsed.data, request.empresa_id)
      if (!servico) return reply.status(404).send(error(404, 'Servico nao encontrado'))
      return success('Servico atualizado', servico)
    },
  })

  app.delete('/servicos/:id', {
    preHandler: [authMiddleware, permissoesMiddleware('servicos', 'deletar')],
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      const deleted = await deleteServico(BigInt(id), request.empresa_id)
      if (!deleted) return reply.status(404).send(error(404, 'Servico nao encontrado'))
      return success('Servico removido')
    },
  })
}
