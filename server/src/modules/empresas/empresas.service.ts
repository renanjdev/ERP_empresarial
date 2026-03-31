import { prisma } from '../../shared/utils/prisma.js'
import { UpdateEmpresaInput } from './empresas.schema.js'

function serializeEmpresa(e: any) {
  return {
    ...e,
    id: e.id.toString(),
  }
}

export async function getEmpresa(empresaId: bigint) {
  const empresa = await prisma.empresa.findFirst({ where: { id: empresaId } })
  if (!empresa) return null
  return serializeEmpresa(empresa)
}

export async function updateEmpresa(empresaId: bigint, data: UpdateEmpresaInput) {
  const empresa = await prisma.empresa.update({
    where: { id: empresaId },
    data,
  })
  return serializeEmpresa(empresa)
}
