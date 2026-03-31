import { prisma } from '../../shared/utils/prisma.js'
import { buildPaginatedQuery, paginationMeta } from '../../shared/utils/crud.js'
import { PaginationParams } from '../../shared/utils/pagination.js'
import { CreateClienteInput, UpdateClienteInput } from './clientes.schema.js'

function serializeCliente(c: any) {
  return {
    ...c,
    id: c.id.toString(),
    empresa_id: c.empresa_id.toString(),
    enderecos: c.enderecos?.map((e: any) => ({
      ...e,
      id: e.id.toString(),
      empresa_id: e.empresa_id.toString(),
      cliente_id: e.cliente_id.toString(),
    })),
    contatos: c.contatos?.map((ct: any) => ({
      ...ct,
      id: ct.id.toString(),
      empresa_id: ct.empresa_id.toString(),
      cliente_id: ct.cliente_id.toString(),
    })),
  }
}

export async function listClientes(params: PaginationParams, empresaId: bigint) {
  const { where, skip, take, orderBy } = buildPaginatedQuery(params, empresaId, ['nome', 'cpf_cnpj', 'email'])
  const [items, total] = await Promise.all([
    prisma.cliente.findMany({ where, skip, take, orderBy, include: { enderecos: true, contatos: true } }),
    prisma.cliente.count({ where }),
  ])
  return {
    items: items.map(serializeCliente),
    meta: paginationMeta(total, params.page, params.per_page),
  }
}

export async function getCliente(id: bigint, empresaId: bigint) {
  const cliente = await prisma.cliente.findFirst({
    where: { id, empresa_id: empresaId, ativo: true },
    include: { enderecos: true, contatos: true },
  })
  if (!cliente) return null
  return serializeCliente(cliente)
}

export async function createCliente(data: CreateClienteInput, empresaId: bigint) {
  const { enderecos, contatos, ...clienteData } = data
  const cliente = await prisma.cliente.create({
    data: {
      ...clienteData,
      empresa_id: empresaId,
      enderecos: {
        create: enderecos?.map(e => ({ ...e, empresa_id: empresaId })) ?? [],
      },
      contatos: {
        create: contatos?.map(c => ({ ...c, empresa_id: empresaId })) ?? [],
      },
    },
    include: { enderecos: true, contatos: true },
  })
  return serializeCliente(cliente)
}

export async function updateCliente(id: bigint, data: UpdateClienteInput, empresaId: bigint) {
  const exists = await prisma.cliente.findFirst({ where: { id, empresa_id: empresaId, ativo: true } })
  if (!exists) return null

  const { enderecos, contatos, ...clienteData } = data

  await prisma.$transaction(async (tx) => {
    if (enderecos !== undefined) {
      await tx.clienteEndereco.deleteMany({ where: { cliente_id: id } })
      if (enderecos.length > 0) {
        await tx.clienteEndereco.createMany({
          data: enderecos.map(e => ({ ...e, cliente_id: id, empresa_id: empresaId })),
        })
      }
    }
    if (contatos !== undefined) {
      await tx.clienteContato.deleteMany({ where: { cliente_id: id } })
      if (contatos.length > 0) {
        await tx.clienteContato.createMany({
          data: contatos.map(c => ({ ...c, cliente_id: id, empresa_id: empresaId })),
        })
      }
    }
    await tx.cliente.update({ where: { id }, data: { ...clienteData, updated_at: new Date() } })
  })

  return getCliente(id, empresaId)
}

export async function deleteCliente(id: bigint, empresaId: bigint) {
  const exists = await prisma.cliente.findFirst({ where: { id, empresa_id: empresaId, ativo: true } })
  if (!exists) return false
  await prisma.cliente.update({ where: { id }, data: { ativo: false } })
  return true
}

export async function autocompleteClientes(q: string, empresaId: bigint) {
  const items = await prisma.cliente.findMany({
    where: {
      empresa_id: empresaId,
      ativo: true,
      OR: [
        { nome: { contains: q, mode: 'insensitive' } },
        { cpf_cnpj: { contains: q, mode: 'insensitive' } },
      ],
    },
    select: { id: true, nome: true, cpf_cnpj: true },
    take: 20,
  })
  return items.map(i => ({ ...i, id: i.id.toString() }))
}
