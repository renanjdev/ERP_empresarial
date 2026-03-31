import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../../shared/middleware/auth.middleware.js'
import { permissoesMiddleware } from '../../shared/middleware/permissoes.middleware.js'
import { paginationSchema } from '../../shared/utils/pagination.js'
import { createClienteSchema, updateClienteSchema } from './clientes.schema.js'
import {
  listClientes,
  getCliente,
  createCliente,
  updateCliente,
  deleteCliente,
  autocompleteClientes,
} from './clientes.service.js'
import { success, created, error } from '../../shared/utils/response.js'

export async function clientesRoutes(app: FastifyInstance) {
  app.get('/clientes', {
    preHandler: [authMiddleware, permissoesMiddleware('clientes', 'listar')],
    handler: async (request, reply) => {
      const parsed = paginationSchema.safeParse(request.query)
      if (!parsed.success) return reply.status(400).send(error(400, 'Parametros invalidos'))
      const result = await listClientes(parsed.data, request.empresa_id)
      return success('Clientes listados', result)
    },
  })

  app.get('/clientes/autocomplete', {
    preHandler: [authMiddleware],
    handler: async (request, reply) => {
      const { q = '' } = request.query as { q?: string }
      const items = await autocompleteClientes(q, request.empresa_id)
      return success('Autocomplete', items)
    },
  })

  app.get('/clientes/:id', {
    preHandler: [authMiddleware, permissoesMiddleware('clientes', 'visualizar')],
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      const cliente = await getCliente(BigInt(id), request.empresa_id)
      if (!cliente) return reply.status(404).send(error(404, 'Cliente nao encontrado'))
      return success('Cliente encontrado', cliente)
    },
  })

  app.post('/clientes', {
    preHandler: [authMiddleware, permissoesMiddleware('clientes', 'criar')],
    handler: async (request, reply) => {
      const parsed = createClienteSchema.safeParse(request.body)
      if (!parsed.success) return reply.status(400).send(error(400, 'Dados invalidos', { errors: parsed.error.issues }))
      const cliente = await createCliente(parsed.data, request.empresa_id)
      return reply.status(201).send(created('Cliente criado', cliente))
    },
  })

  app.put('/clientes/:id', {
    preHandler: [authMiddleware, permissoesMiddleware('clientes', 'editar')],
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      const parsed = updateClienteSchema.safeParse(request.body)
      if (!parsed.success) return reply.status(400).send(error(400, 'Dados invalidos', { errors: parsed.error.issues }))
      const cliente = await updateCliente(BigInt(id), parsed.data, request.empresa_id)
      if (!cliente) return reply.status(404).send(error(404, 'Cliente nao encontrado'))
      return success('Cliente atualizado', cliente)
    },
  })

  app.delete('/clientes/:id', {
    preHandler: [authMiddleware, permissoesMiddleware('clientes', 'deletar')],
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      const deleted = await deleteCliente(BigInt(id), request.empresa_id)
      if (!deleted) return reply.status(404).send(error(404, 'Cliente nao encontrado'))
      return success('Cliente removido')
    },
  })
}
