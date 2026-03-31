import bcrypt from 'bcryptjs'
import { prisma } from '../../shared/utils/prisma.js'
import { buildPaginatedQuery, paginationMeta } from '../../shared/utils/crud.js'
import { PaginationParams } from '../../shared/utils/pagination.js'
import { CreateUsuarioInput, UpdateUsuarioInput } from './usuarios.schema.js'

function serializeUsuario(u: any) {
  const { senha_hash, ...rest } = u
  return {
    ...rest,
    id: u.id.toString(),
    empresa_id: u.empresa_id.toString(),
    grupo_usuario_id: u.grupo_usuario_id?.toString() ?? null,
    grupo_usuario: u.grupo_usuario
      ? { ...u.grupo_usuario, id: u.grupo_usuario.id.toString(), empresa_id: u.grupo_usuario.empresa_id.toString() }
      : null,
  }
}

export async function listUsuarios(params: PaginationParams, empresaId: bigint) {
  const { where, skip, take, orderBy } = buildPaginatedQuery(params, empresaId, ['nome', 'email'])
  const [items, total] = await Promise.all([
    prisma.usuario.findMany({ where, skip, take, orderBy, include: { grupo_usuario: true } }),
    prisma.usuario.count({ where }),
  ])
  return {
    items: items.map(serializeUsuario),
    meta: paginationMeta(total, params.page, params.per_page),
  }
}

export async function getUsuario(id: bigint, empresaId: bigint) {
  const usuario = await prisma.usuario.findFirst({
    where: { id, empresa_id: empresaId, ativo: true },
    include: { grupo_usuario: true },
  })
  if (!usuario) return null
  return serializeUsuario(usuario)
}

export async function createUsuario(data: CreateUsuarioInput, empresaId: bigint) {
  const { senha, ...rest } = data
  const senha_hash = await bcrypt.hash(senha, 10)
  const usuario = await prisma.usuario.create({
    data: { ...rest, empresa_id: empresaId, senha_hash },
    include: { grupo_usuario: true },
  })
  return serializeUsuario(usuario)
}

export async function updateUsuario(id: bigint, data: UpdateUsuarioInput, empresaId: bigint) {
  const exists = await prisma.usuario.findFirst({ where: { id, empresa_id: empresaId, ativo: true } })
  if (!exists) return null

  const { senha, ...rest } = data
  const updateData: any = { ...rest, updated_at: new Date() }
  if (senha) {
    updateData.senha_hash = await bcrypt.hash(senha, 10)
  }

  const usuario = await prisma.usuario.update({
    where: { id },
    data: updateData,
    include: { grupo_usuario: true },
  })
  return serializeUsuario(usuario)
}

export async function deleteUsuario(id: bigint, empresaId: bigint) {
  const exists = await prisma.usuario.findFirst({ where: { id, empresa_id: empresaId, ativo: true } })
  if (!exists) return false
  await prisma.usuario.update({ where: { id }, data: { ativo: false } })
  return true
}

export async function autocompleteUsuarios(q: string, empresaId: bigint) {
  const items = await prisma.usuario.findMany({
    where: {
      empresa_id: empresaId,
      ativo: true,
      OR: [
        { nome: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
      ],
    },
    select: { id: true, nome: true, email: true },
    take: 20,
  })
  return items.map(i => ({ ...i, id: i.id.toString() }))
}
