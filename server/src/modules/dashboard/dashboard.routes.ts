import { FastifyInstance } from 'fastify'
import { authMiddleware } from '../../shared/middleware/auth.middleware.js'
import { prisma } from '../../shared/utils/prisma.js'
import { success } from '../../shared/utils/response.js'

export async function dashboardRoutes(app: FastifyInstance) {
  app.get('/dashboard/resumo', {
    preHandler: [authMiddleware],
    handler: async (request, reply) => {
      const empresaId = request.empresa_id
      const [total_clientes, total_fornecedores, total_produtos, total_servicos] = await Promise.all([
        prisma.cliente.count({ where: { empresa_id: empresaId, ativo: true } }),
        prisma.fornecedor.count({ where: { empresa_id: empresaId, ativo: true } }),
        prisma.produto.count({ where: { empresa_id: empresaId, ativo: true } }),
        prisma.servico.count({ where: { empresa_id: empresaId, ativo: true } }),
      ])
      return success('Dashboard resumo', {
        total_clientes,
        total_fornecedores,
        total_produtos,
        total_servicos,
        financeiro: null,
      })
    },
  })
}
