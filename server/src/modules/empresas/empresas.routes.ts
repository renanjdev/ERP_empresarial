import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../../shared/middleware/auth.middleware.js'
import { updateEmpresaSchema } from './empresas.schema.js'
import { getEmpresa, updateEmpresa } from './empresas.service.js'
import { success, error } from '../../shared/utils/response.js'

export async function empresasRoutes(app: FastifyInstance) {
  app.get('/empresas/visualizar', {
    preHandler: [authMiddleware],
    handler: async (request, reply) => {
      const empresa = await getEmpresa(request.empresa_id)
      if (!empresa) return reply.status(404).send(error(404, 'Empresa nao encontrada'))
      return success('Empresa encontrada', empresa)
    },
  })

  app.post('/empresas/editar', {
    preHandler: [authMiddleware],
    handler: async (request, reply) => {
      const parsed = updateEmpresaSchema.safeParse(request.body)
      if (!parsed.success) return reply.status(400).send(error(400, 'Dados invalidos', { errors: parsed.error.issues }))
      const empresa = await updateEmpresa(request.empresa_id, parsed.data)
      return success('Empresa atualizada', empresa)
    },
  })
}
