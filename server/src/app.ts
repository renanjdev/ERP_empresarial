import Fastify from 'fastify'
import cors from '@fastify/cors'
import cookie from '@fastify/cookie'

const app = Fastify({ logger: true })

// BigInt serialization for JSON responses
;(BigInt.prototype as any).toJSON = function () { return this.toString() }

// Global error handler
app.setErrorHandler((error, request, reply) => {
  const statusCode = error.statusCode || 500
  reply.status(statusCode).send({
    code: statusCode,
    status: 'error',
    message: error.message || 'Erro interno',
    data: null,
  })
})

await app.register(cors, {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
})
await app.register(cookie)

app.get('/health', async () => ({ status: 'ok' }))

const port = Number(process.env.PORT) || 3000
await app.listen({ port, host: '0.0.0.0' })
console.log(`Server running on http://localhost:${port}`)
