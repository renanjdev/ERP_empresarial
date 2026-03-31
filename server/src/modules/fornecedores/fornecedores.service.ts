import { prisma } from '../../shared/utils/prisma.js'
import { buildPaginatedQuery, paginationMeta } from '../../shared/utils/crud.js'
import { PaginationParams } from '../../shared/utils/pagination.js'
import { CreateFornecedorInput, UpdateFornecedorInput } from './fornecedores.schema.js'

function serializeFornecedor(f: any) {
  return {
    ...f,
    id: f.id.toString(),
    empresa_id: f.empresa_id.toString(),
    enderecos: f.enderecos?.map((e: any) => ({
      ...e,
      id: e.id.toString(),
      empresa_id: e.empresa_id.toString(),
      fornecedor_id: e.fornecedor_id.toString(),
    })),
    contatos: f.contatos?.map((c: any) => ({
      ...c,
      id: c.id.toString(),
      empresa_id: c.empresa_id.toString(),
      fornecedor_id: c.fornecedor_id.toString(),
    })),
  }
}

export async function listFornecedores(params: PaginationParams, empresaId: bigint) {
  const { where, skip, take, orderBy } = buildPaginatedQuery(params, empresaId, ['razao_social', 'cnpj', 'email'])
  const [items, total] = await Promise.all([
    prisma.fornecedor.findMany({ where, skip, take, orderBy, include: { enderecos: true, contatos: true } }),
    prisma.fornecedor.count({ where }),
  ])
  return {
    items: items.map(serializeFornecedor),
    meta: paginationMeta(total, params.page, params.per_page),
  }
}

export async function getFornecedor(id: bigint, empresaId: bigint) {
  const fornecedor = await prisma.fornecedor.findFirst({
    where: { id, empresa_id: empresaId, ativo: true },
    include: { enderecos: true, contatos: true },
  })
  if (!fornecedor) return null
  return serializeFornecedor(fornecedor)
}

export async function createFornecedor(data: CreateFornecedorInput, empresaId: bigint) {
  const { enderecos, contatos, ...fornecedorData } = data
  const fornecedor = await prisma.fornecedor.create({
    data: {
      ...fornecedorData,
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
  return serializeFornecedor(fornecedor)
}

export async function updateFornecedor(id: bigint, data: UpdateFornecedorInput, empresaId: bigint) {
  const exists = await prisma.fornecedor.findFirst({ where: { id, empresa_id: empresaId, ativo: true } })
  if (!exists) return null

  const { enderecos, contatos, ...fornecedorData } = data

  await prisma.$transaction(async (tx) => {
    if (enderecos !== undefined) {
      await tx.fornecedorEndereco.deleteMany({ where: { fornecedor_id: id } })
      if (enderecos.length > 0) {
        await tx.fornecedorEndereco.createMany({
          data: enderecos.map(e => ({ ...e, fornecedor_id: id, empresa_id: empresaId })),
        })
      }
    }
    if (contatos !== undefined) {
      await tx.fornecedorContato.deleteMany({ where: { fornecedor_id: id } })
      if (contatos.length > 0) {
        await tx.fornecedorContato.createMany({
          data: contatos.map(c => ({ ...c, fornecedor_id: id, empresa_id: empresaId })),
        })
      }
    }
    await tx.fornecedor.update({ where: { id }, data: { ...fornecedorData, updated_at: new Date() } })
  })

  return getFornecedor(id, empresaId)
}

export async function deleteFornecedor(id: bigint, empresaId: bigint) {
  const exists = await prisma.fornecedor.findFirst({ where: { id, empresa_id: empresaId, ativo: true } })
  if (!exists) return false
  await prisma.fornecedor.update({ where: { id }, data: { ativo: false } })
  return true
}

export async function autocompleteFornecedores(q: string, empresaId: bigint) {
  const items = await prisma.fornecedor.findMany({
    where: {
      empresa_id: empresaId,
      ativo: true,
      OR: [
        { razao_social: { contains: q, mode: 'insensitive' } },
        { cnpj: { contains: q, mode: 'insensitive' } },
      ],
    },
    select: { id: true, razao_social: true, cnpj: true },
    take: 20,
  })
  return items.map(i => ({ ...i, id: i.id.toString() }))
}
