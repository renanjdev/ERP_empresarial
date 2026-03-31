import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../../shared/middleware/auth.middleware.js'
import { permissoesMiddleware } from '../../shared/middleware/permissoes.middleware.js'
import { paginationSchema } from '../../shared/utils/pagination.js'
import { createCategoriaSchema, updateCategoriaSchema } from './categorias.schema.js'
import { listCategorias, getCategoria, createCategoria, updateCategoria, deleteCategoria } from './categorias.service.js'
import { success, created, error } from '../../shared/utils/response.js'

export async function categoriasRoutes(app: FastifyInstance) {
  app.get('/categorias', {
    preHandler: [authMiddleware, permissoesMiddleware('categorias', 'listar')],
    handler: async (request, reply) => {
      const parsed = paginationSchema.safeParse(request.query)
      if (!parsed.success) return reply.status(400).send(error(400, 'Parametros invalidos'))
      const result = await listCategorias(parsed.data, request.empresa_id)
      return success('Categorias listadas', result)
    },
  })

  app.get('/categorias/:id', {
    preHandler: [authMiddleware, permissoesMiddleware('categorias', 'visualizar')],
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      const categoria = await getCategoria(BigInt(id), request.empresa_id)
      if (!categoria) return reply.status(404).send(error(404, 'Categoria nao encontrada'))
      return success('Categoria encontrada', categoria)
    },
  })

  app.post('/categorias', {
    preHandler: [authMiddleware, permissoesMiddleware('categorias', 'criar')],
    handler: async (request, reply) => {
      const parsed = createCategoriaSchema.safeParse(request.body)
      if (!parsed.success) return reply.status(400).send(error(400, 'Dados invalidos', { errors: parsed.error.issues }))
      const categoria = await createCategoria(parsed.data, request.empresa_id)
      return reply.status(201).send(created('Categoria criada', categoria))
    },
  })

  app.put('/categorias/:id', {
    preHandler: [authMiddleware, permissoesMiddleware('categorias', 'editar')],
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      const parsed = updateCategoriaSchema.safeParse(request.body)
      if (!parsed.success) return reply.status(400).send(error(400, 'Dados invalidos', { errors: parsed.error.issues }))
      const categoria = await updateCategoria(BigInt(id), parsed.data, request.empresa_id)
      if (!categoria) return reply.status(404).send(error(404, 'Categoria nao encontrada'))
      return success('Categoria atualizada', categoria)
    },
  })

  app.delete('/categorias/:id', {
    preHandler: [authMiddleware, permissoesMiddleware('categorias', 'deletar')],
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      const deleted = await deleteCategoria(BigInt(id), request.empresa_id)
      if (!deleted) return reply.status(404).send(error(404, 'Categoria nao encontrada'))
      return success('Categoria removida')
    },
  })
}
