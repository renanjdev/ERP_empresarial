import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../../shared/middleware/auth.middleware.js'
import { permissoesMiddleware } from '../../shared/middleware/permissoes.middleware.js'
import { paginationSchema } from '../../shared/utils/pagination.js'
import { createCentroCustoSchema, updateCentroCustoSchema } from './centros_custos.schema.js'
import {
  listCentrosCustos,
  getCentroCusto,
  createCentroCusto,
  updateCentroCusto,
  deleteCentroCusto,
} from './centros_custos.service.js'
import { success, created, error } from '../../shared/utils/response.js'

export async function centrosCustosRoutes(app: FastifyInstance) {
  app.get('/centros-custos', {
    preHandler: [authMiddleware, permissoesMiddleware('centros_custos', 'listar')],
    handler: async (request, reply) => {
      const parsed = paginationSchema.safeParse(request.query)
      if (!parsed.success) return reply.status(400).send(error(400, 'Parametros invalidos'))
      const result = await listCentrosCustos(parsed.data, request.empresa_id)
      return success('Centros de custo listados', result)
    },
  })

  app.get('/centros-custos/:id', {
    preHandler: [authMiddleware, permissoesMiddleware('centros_custos', 'visualizar')],
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      const centro = await getCentroCusto(BigInt(id), request.empresa_id)
      if (!centro) return reply.status(404).send(error(404, 'Centro de custo nao encontrado'))
      return success('Centro de custo encontrado', centro)
    },
  })

  app.post('/centros-custos', {
    preHandler: [authMiddleware, permissoesMiddleware('centros_custos', 'criar')],
    handler: async (request, reply) => {
      const parsed = createCentroCustoSchema.safeParse(request.body)
      if (!parsed.success) return reply.status(400).send(error(400, 'Dados invalidos', { errors: parsed.error.issues }))
      const centro = await createCentroCusto(parsed.data, request.empresa_id)
      return reply.status(201).send(created('Centro de custo criado', centro))
    },
  })

  app.put('/centros-custos/:id', {
    preHandler: [authMiddleware, permissoesMiddleware('centros_custos', 'editar')],
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      const parsed = updateCentroCustoSchema.safeParse(request.body)
      if (!parsed.success) return reply.status(400).send(error(400, 'Dados invalidos', { errors: parsed.error.issues }))
      const centro = await updateCentroCusto(BigInt(id), parsed.data, request.empresa_id)
      if (!centro) return reply.status(404).send(error(404, 'Centro de custo nao encontrado'))
      return success('Centro de custo atualizado', centro)
    },
  })

  app.delete('/centros-custos/:id', {
    preHandler: [authMiddleware, permissoesMiddleware('centros_custos', 'deletar')],
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      const deleted = await deleteCentroCusto(BigInt(id), request.empresa_id)
      if (!deleted) return reply.status(404).send(error(404, 'Centro de custo nao encontrado'))
      return success('Centro de custo removido')
    },
  })
}
