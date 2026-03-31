import 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    empresa_id: bigint
    usuario_id: bigint
  }
}
