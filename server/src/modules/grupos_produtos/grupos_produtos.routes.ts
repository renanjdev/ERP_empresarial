import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../../shared/middleware/auth.middleware.js'
import { permissoesMiddleware } from '../../shared/middleware/permissoes.middleware.js'
import { paginationSchema } from '../../shared/utils/pagination.js'
import { createGrupoProdutoSchema, updateGrupoProdutoSchema } from './grupos_produtos.schema.js'
import {
  listGruposProdutos,
  getGrupoProduto,
  createGrupoProduto,
  updateGrupoProduto,
  deleteGrupoProduto,
  autocompleteGruposProdutos,
} from './grupos_produtos.service.js'
import { success, created, error } from '../../shared/utils/response.js'

export async function gruposProdutosRoutes(app: FastifyInstance) {
  app.get('/grupos-produtos', {
    preHandler: [authMiddleware, permissoesMiddleware('grupos_produtos', 'listar')],
    handler: async (request, reply) => {
      const parsed = paginationSchema.safeParse(request.query)
      if (!parsed.success) return reply.status(400).send(error(400, 'Parametros invalidos'))
      const result = await listGruposProdutos(parsed.data, request.empresa_id)
      return success('Grupos de produto listados', result)
    },
  })

  app.get('/grupos-produtos/autocomplete', {
    preHandler: [authMiddleware],
    handler: async (request, reply) => {
      const { q = '' } = request.query as { q?: string }
      const items = await autocompleteGruposProdutos(q, request.empresa_id)
      return success('Autocomplete', items)
    },
  })

  app.get('/grupos-produtos/:id', {
    preHandler: [authMiddleware, permissoesMiddleware('grupos_produtos', 'visualizar')],
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      const grupo = await getGrupoProduto(BigInt(id), request.empresa_id)
      if (!grupo) return reply.status(404).send(error(404, 'Grupo de produto nao encontrado'))
      return success('Grupo de produto encontrado', grupo)
    },
  })

  app.post('/grupos-produtos', {
    preHandler: [authMiddleware, permissoesMiddleware('grupos_produtos', 'criar')],
    handler: async (request, reply) => {
      const parsed = createGrupoProdutoSchema.safeParse(request.body)
      if (!parsed.success) return reply.status(400).send(error(400, 'Dados invalidos', { errors: parsed.error.issues }))
      const grupo = await createGrupoProduto(parsed.data, request.empresa_id)
      return reply.status(201).send(created('Grupo de produto criado', grupo))
    },
  })

  app.put('/grupos-produtos/:id', {
    preHandler: [authMiddleware, permissoesMiddleware('grupos_produtos', 'editar')],
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      const parsed = updateGrupoProdutoSchema.safeParse(request.body)
      if (!parsed.success) return reply.status(400).send(error(400, 'Dados invalidos', { errors: parsed.error.issues }))
      const grupo = await updateGrupoProduto(BigInt(id), parsed.data, request.empresa_id)
      if (!grupo) return reply.status(404).send(error(404, 'Grupo de produto nao encontrado'))
      return success('Grupo de produto atualizado', grupo)
    },
  })

  app.delete('/grupos-produtos/:id', {
    preHandler: [authMiddleware, permissoesMiddleware('grupos_produtos', 'deletar')],
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      const deleted = await deleteGrupoProduto(BigInt(id), request.empresa_id)
      if (!deleted) return reply.status(404).send(error(404, 'Grupo de produto nao encontrado'))
      return success('Grupo de produto removido')
    },
  })
}
