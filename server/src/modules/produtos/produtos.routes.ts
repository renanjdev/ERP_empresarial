import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../../shared/middleware/auth.middleware.js'
import { permissoesMiddleware } from '../../shared/middleware/permissoes.middleware.js'
import { paginationSchema } from '../../shared/utils/pagination.js'
import { createProdutoSchema, updateProdutoSchema } from './produtos.schema.js'
import {
  listProdutos,
  getProduto,
  createProduto,
  updateProduto,
  deleteProduto,
  autocompleteProdutos,
} from './produtos.service.js'
import { success, created, error } from '../../shared/utils/response.js'

export async function produtosRoutes(app: FastifyInstance) {
  app.get('/produtos', {
    preHandler: [authMiddleware, permissoesMiddleware('produtos', 'listar')],
    handler: async (request, reply) => {
      const parsed = paginationSchema.safeParse(request.query)
      if (!parsed.success) return reply.status(400).send(error(400, 'Parametros invalidos'))
      const result = await listProdutos(parsed.data, request.empresa_id)
      return success('Produtos listados', result)
    },
  })

  app.get('/produtos/autocomplete', {
    preHandler: [authMiddleware],
    handler: async (request, reply) => {
      const { q = '' } = request.query as { q?: string }
      const items = await autocompleteProdutos(q, request.empresa_id)
      return success('Autocomplete', items)
    },
  })

  app.get('/produtos/:id', {
    preHandler: [authMiddleware, permissoesMiddleware('produtos', 'visualizar')],
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      const produto = await getProduto(BigInt(id), request.empresa_id)
      if (!produto) return reply.status(404).send(error(404, 'Produto nao encontrado'))
      return success('Produto encontrado', produto)
    },
  })

  app.post('/produtos', {
    preHandler: [authMiddleware, permissoesMiddleware('produtos', 'criar')],
    handler: async (request, reply) => {
      const parsed = createProdutoSchema.safeParse(request.body)
      if (!parsed.success) return reply.status(400).send(error(400, 'Dados invalidos', { errors: parsed.error.issues }))
      const produto = await createProduto(parsed.data, request.empresa_id)
      return reply.status(201).send(created('Produto criado', produto))
    },
  })

  app.put('/produtos/:id', {
    preHandler: [authMiddleware, permissoesMiddleware('produtos', 'editar')],
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      const parsed = updateProdutoSchema.safeParse(request.body)
      if (!parsed.success) return reply.status(400).send(error(400, 'Dados invalidos', { errors: parsed.error.issues }))
      const produto = await updateProduto(BigInt(id), parsed.data, request.empresa_id)
      if (!produto) return reply.status(404).send(error(404, 'Produto nao encontrado'))
      return success('Produto atualizado', produto)
    },
  })

  app.delete('/produtos/:id', {
    preHandler: [authMiddleware, permissoesMiddleware('produtos', 'deletar')],
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      const deleted = await deleteProduto(BigInt(id), request.empresa_id)
      if (!deleted) return reply.status(404).send(error(404, 'Produto nao encontrado'))
      return success('Produto removido')
    },
  })
}
