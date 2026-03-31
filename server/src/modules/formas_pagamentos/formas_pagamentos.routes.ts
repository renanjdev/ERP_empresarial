import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../../shared/middleware/auth.middleware.js'
import { permissoesMiddleware } from '../../shared/middleware/permissoes.middleware.js'
import { paginationSchema } from '../../shared/utils/pagination.js'
import { createFormaPagamentoSchema, updateFormaPagamentoSchema } from './formas_pagamentos.schema.js'
import {
  listFormasPagamentos,
  getFormaPagamento,
  createFormaPagamento,
  updateFormaPagamento,
  deleteFormaPagamento,
} from './formas_pagamentos.service.js'
import { success, created, error } from '../../shared/utils/response.js'

export async function formasPagamentosRoutes(app: FastifyInstance) {
  app.get('/formas-pagamentos', {
    preHandler: [authMiddleware, permissoesMiddleware('formas_pagamentos', 'listar')],
    handler: async (request, reply) => {
      const parsed = paginationSchema.safeParse(request.query)
      if (!parsed.success) return reply.status(400).send(error(400, 'Parametros invalidos'))
      const result = await listFormasPagamentos(parsed.data, request.empresa_id)
      return success('Formas de pagamento listadas', result)
    },
  })

  app.get('/formas-pagamentos/:id', {
    preHandler: [authMiddleware, permissoesMiddleware('formas_pagamentos', 'visualizar')],
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      const forma = await getFormaPagamento(BigInt(id), request.empresa_id)
      if (!forma) return reply.status(404).send(error(404, 'Forma de pagamento nao encontrada'))
      return success('Forma de pagamento encontrada', forma)
    },
  })

  app.post('/formas-pagamentos', {
    preHandler: [authMiddleware, permissoesMiddleware('formas_pagamentos', 'criar')],
    handler: async (request, reply) => {
      const parsed = createFormaPagamentoSchema.safeParse(request.body)
      if (!parsed.success) return reply.status(400).send(error(400, 'Dados invalidos', { errors: parsed.error.issues }))
      const forma = await createFormaPagamento(parsed.data, request.empresa_id)
      return reply.status(201).send(created('Forma de pagamento criada', forma))
    },
  })

  app.put('/formas-pagamentos/:id', {
    preHandler: [authMiddleware, permissoesMiddleware('formas_pagamentos', 'editar')],
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      const parsed = updateFormaPagamentoSchema.safeParse(request.body)
      if (!parsed.success) return reply.status(400).send(error(400, 'Dados invalidos', { errors: parsed.error.issues }))
      const forma = await updateFormaPagamento(BigInt(id), parsed.data, request.empresa_id)
      if (!forma) return reply.status(404).send(error(404, 'Forma de pagamento nao encontrada'))
      return success('Forma de pagamento atualizada', forma)
    },
  })

  app.delete('/formas-pagamentos/:id', {
    preHandler: [authMiddleware, permissoesMiddleware('formas_pagamentos', 'deletar')],
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      const deleted = await deleteFormaPagamento(BigInt(id), request.empresa_id)
      if (!deleted) return reply.status(404).send(error(404, 'Forma de pagamento nao encontrada'))
      return success('Forma de pagamento removida')
    },
  })
}
