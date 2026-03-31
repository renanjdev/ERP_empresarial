import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../../shared/middleware/auth.middleware.js'
import { permissoesMiddleware } from '../../shared/middleware/permissoes.middleware.js'
import { paginationSchema } from '../../shared/utils/pagination.js'
import { createUnidadeSchema, updateUnidadeSchema } from './unidades.schema.js'
import {
  listUnidades,
  getUnidade,
  createUnidade,
  updateUnidade,
  deleteUnidade,
  autocompleteUnidades,
} from './unidades.service.js'
import { success, created, error } from '../../shared/utils/response.js'

export async function unidadesRoutes(app: FastifyInstance) {
  app.get('/unidades', {
    preHandler: [authMiddleware, permissoesMiddleware('unidades', 'listar')],
    handler: async (request, reply) => {
      const parsed = paginationSchema.safeParse(request.query)
      if (!parsed.success) return reply.status(400).send(error(400, 'Parametros invalidos'))
      const result = await listUnidades(parsed.data, request.empresa_id)
      return success('Unidades listadas', result)
    },
  })

  app.get('/unidades/autocomplete', {
    preHandler: [authMiddleware],
    handler: async (request, reply) => {
      const { q = '' } = request.query as { q?: string }
      const items = await autocompleteUnidades(q, request.empresa_id)
      return success('Autocomplete', items)
    },
  })

  app.get('/unidades/:id', {
    preHandler: [authMiddleware, permissoesMiddleware('unidades', 'visualizar')],
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      const unidade = await getUnidade(BigInt(id), request.empresa_id)
      if (!unidade) return reply.status(404).send(error(404, 'Unidade nao encontrada'))
      return success('Unidade encontrada', unidade)
    },
  })

  app.post('/unidades', {
    preHandler: [authMiddleware, permissoesMiddleware('unidades', 'criar')],
    handler: async (request, reply) => {
      const parsed = createUnidadeSchema.safeParse(request.body)
      if (!parsed.success) return reply.status(400).send(error(400, 'Dados invalidos', { errors: parsed.error.issues }))
      const unidade = await createUnidade(parsed.data, request.empresa_id)
      return reply.status(201).send(created('Unidade criada', unidade))
    },
  })

  app.put('/unidades/:id', {
    preHandler: [authMiddleware, permissoesMiddleware('unidades', 'editar')],
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      const parsed = updateUnidadeSchema.safeParse(request.body)
      if (!parsed.success) return reply.status(400).send(error(400, 'Dados invalidos', { errors: parsed.error.issues }))
      const unidade = await updateUnidade(BigInt(id), parsed.data, request.empresa_id)
      if (!unidade) return reply.status(404).send(error(404, 'Unidade nao encontrada'))
      return success('Unidade atualizada', unidade)
    },
  })

  app.delete('/unidades/:id', {
    preHandler: [authMiddleware, permissoesMiddleware('unidades', 'deletar')],
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      const deleted = await deleteUnidade(BigInt(id), request.empresa_id)
      if (!deleted) return reply.status(404).send(error(404, 'Unidade nao encontrada'))
      return success('Unidade removida')
    },
  })
}
