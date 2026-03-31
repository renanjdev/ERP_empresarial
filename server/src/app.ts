import Fastify from 'fastify'
import cors from '@fastify/cors'
import cookie from '@fastify/cookie'
import { authRoutes } from './modules/auth/auth.routes.js'
import { clientesRoutes } from './modules/clientes/clientes.routes.js'
import { fornecedoresRoutes } from './modules/fornecedores/fornecedores.routes.js'
import { produtosRoutes } from './modules/produtos/produtos.routes.js'
import { servicosRoutes } from './modules/servicos/servicos.routes.js'
import { formasPagamentosRoutes } from './modules/formas_pagamentos/formas_pagamentos.routes.js'
import { categoriasRoutes } from './modules/categorias/categorias.routes.js'
import { centrosCustosRoutes } from './modules/centros_custos/centros_custos.routes.js'
import { gruposProdutosRoutes } from './modules/grupos_produtos/grupos_produtos.routes.js'
import { unidadesRoutes } from './modules/unidades/unidades.routes.js'
import { empresasRoutes } from './modules/empresas/empresas.routes.js'
import { usuariosRoutes } from './modules/usuarios/usuarios.routes.js'
import { dashboardRoutes } from './modules/dashboard/dashboard.routes.js'

const app = Fastify({ logger: true })

// BigInt serialization for JSON responses
;(BigInt.prototype as any).toJSON = function () { return this.toString() }

// Global error handler
app.setErrorHandler((err: any, request, reply) => {
  const statusCode = err.statusCode || 500
  reply.status(statusCode).send({
    code: statusCode,
    status: 'error',
    message: err.message || 'Erro interno',
    data: null,
  })
})

await app.register(cors, {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
})
await app.register(cookie)

app.get('/health', async () => ({ status: 'ok' }))

await app.register(authRoutes)
await app.register(clientesRoutes)
await app.register(fornecedoresRoutes)
await app.register(produtosRoutes)
await app.register(servicosRoutes)
await app.register(formasPagamentosRoutes)
await app.register(categoriasRoutes)
await app.register(centrosCustosRoutes)
await app.register(gruposProdutosRoutes)
await app.register(unidadesRoutes)
await app.register(empresasRoutes)
await app.register(usuariosRoutes)
await app.register(dashboardRoutes)

const port = Number(process.env.PORT) || 3000
await app.listen({ port, host: '0.0.0.0' })
console.log(`Server running on http://localhost:${port}`)
