import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../../shared/middleware/auth.middleware.js'
import { permissoesMiddleware } from '../../shared/middleware/permissoes.middleware.js'
import { paginationSchema } from '../../shared/utils/pagination.js'
import { createUsuarioSchema, updateUsuarioSchema } from './usuarios.schema.js'
import {
  listUsuarios,
  getUsuario,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  autocompleteUsuarios,
} from './usuarios.service.js'
import { success, created, error } from '../../shared/utils/response.js'

export async function usuariosRoutes(app: FastifyInstance) {
  app.get('/usuarios', {
    preHandler: [authMiddleware, permissoesMiddleware('usuarios', 'listar')],
    handler: async (request, reply) => {
      const parsed = paginationSchema.safeParse(request.query)
      if (!parsed.success) return reply.status(400).send(error(400, 'Parametros invalidos'))
      const result = await listUsuarios(parsed.data, request.empresa_id)
      return success('Usuarios listados', result)
    },
  })

  app.get('/usuarios/autocomplete', {
    preHandler: [authMiddleware],
    handler: async (request, reply) => {
      const { q = '' } = request.query as { q?: string }
      const items = await autocompleteUsuarios(q, request.empresa_id)
      return success('Autocomplete', items)
    },
  })

  app.get('/usuarios/:id', {
    preHandler: [authMiddleware, permissoesMiddleware('usuarios', 'visualizar')],
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      const usuario = await getUsuario(BigInt(id), request.empresa_id)
      if (!usuario) return reply.status(404).send(error(404, 'Usuario nao encontrado'))
      return success('Usuario encontrado', usuario)
    },
  })

  app.post('/usuarios', {
    preHandler: [authMiddleware, permissoesMiddleware('usuarios', 'criar')],
    handler: async (request, reply) => {
      const parsed = createUsuarioSchema.safeParse(request.body)
      if (!parsed.success) return reply.status(400).send(error(400, 'Dados invalidos', { errors: parsed.error.issues }))
      try {
        const usuario = await createUsuario(parsed.data, request.empresa_id)
        return reply.status(201).send(created('Usuario criado', usuario))
      } catch (err: any) {
        if (err.code === 'P2002') {
          return reply.status(400).send(error(400, 'Email ja cadastrado'))
        }
        throw err
      }
    },
  })

  app.put('/usuarios/:id', {
    preHandler: [authMiddleware, permissoesMiddleware('usuarios', 'editar')],
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      const parsed = updateUsuarioSchema.safeParse(request.body)
      if (!parsed.success) return reply.status(400).send(error(400, 'Dados invalidos', { errors: parsed.error.issues }))
      try {
        const usuario = await updateUsuario(BigInt(id), parsed.data, request.empresa_id)
        if (!usuario) return reply.status(404).send(error(404, 'Usuario nao encontrado'))
        return success('Usuario atualizado', usuario)
      } catch (err: any) {
        if (err.code === 'P2002') {
          return reply.status(400).send(error(400, 'Email ja cadastrado'))
        }
        throw err
      }
    },
  })

  app.delete('/usuarios/:id', {
    preHandler: [authMiddleware, permissoesMiddleware('usuarios', 'deletar')],
    handler: async (request, reply) => {
      const { id } = request.params as { id: string }
      const deleted = await deleteUsuario(BigInt(id), request.empresa_id)
      if (!deleted) return reply.status(404).send(error(404, 'Usuario nao encontrado'))
      return success('Usuario removido')
    },
  })
}
