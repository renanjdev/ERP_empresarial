import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../../shared/middleware/auth.middleware.js'
import { permissoesMiddleware } from '../../shared/middleware/permissoes.middleware.js'
import { paginationSchema } from '../../shared/utils/pagination.js'
import { createFornecedorSchema, updateFornecedorSchema } from './fornecedores.schema.js'
import {
  listFornecedores,
  getFornecedor,
  createFornecedor,
  updateFornecedor,
  deleteFornecedor,
  autocompleteFornecedores,
} from './fornecedores.service.js'
import { success, created, error } from '../../shared/utils/response.js'

export async function fornecedoresRoutes(app: FastifyInstance) {
  app.get('/fornecedores', {
    preHandler: [authMiddleware, permissoesMiddleware('fornecedores', 'listar')],
    handler: async (request, reply) => {
      const parsed = paginationSchema.safeParse(request.query)
      if (!parsed.success) return reply.status(400).send(error(400, 'Parametros invalidos'))
      const result = await listFornecedores(parsed.data, request.empresa_id)
      return success('Fornecedores listados', result)
    },
  })

  app.get('/fornecedores/autocomplete', {
    preHandler: [authMiddleware],
    handler: async (request, reply) => {
      const { q = '' } = request.query as { q?: string }
      const items = await autocompleteFornecedores(q, request.empresa_id)
      return success('Autocomplete', items)
    },
  })

  app.get('/fornecedores/:id', {
    preHandler: [authMiddleware, permissoesMiddleware('fornecedores', 'visualizar')],
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      const fornecedor = await getFornecedor(BigInt(id), request.empresa_id)
      if (!fornecedor) return reply.status(404).send(error(404, 'Fornecedor nao encontrado'))
      return success('Fornecedor encontrado', fornecedor)
    },
  })

  app.post('/fornecedores', {
    preHandler: [authMiddleware, permissoesMiddleware('fornecedores', 'criar')],
    handler: async (request, reply) => {
      const parsed = createFornecedorSchema.safeParse(request.body)
      if (!parsed.success) return reply.status(400).send(error(400, 'Dados invalidos', { errors: parsed.error.issues }))
      const fornecedor = await createFornecedor(parsed.data, request.empresa_id)
      return reply.status(201).send(created('Fornecedor criado', fornecedor))
    },
  })

  app.put('/fornecedores/:id', {
    preHandler: [authMiddleware, permissoesMiddleware('fornecedores', 'editar')],
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      const parsed = updateFornecedorSchema.safeParse(request.body)
      if (!parsed.success) return reply.status(400).send(error(400, 'Dados invalidos', { errors: parsed.error.issues }))
      const fornecedor = await updateFornecedor(BigInt(id), parsed.data, request.empresa_id)
      if (!fornecedor) return reply.status(404).send(error(404, 'Fornecedor nao encontrado'))
      return success('Fornecedor atualizado', fornecedor)
    },
  })

  app.delete('/fornecedores/:id', {
    preHandler: [authMiddleware, permissoesMiddleware('fornecedores', 'deletar')],
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      const deleted = await deleteFornecedor(BigInt(id), request.empresa_id)
      if (!deleted) return reply.status(404).send(error(404, 'Fornecedor nao encontrado'))
      return success('Fornecedor removido')
    },
  })
}
