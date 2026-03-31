import bcrypt from 'bcryptjs'
import { prisma } from '../../shared/utils/prisma.js'
import { signAccessToken, signRefreshToken } from '../../shared/utils/jwt.js'

export async function login(email: string, senha: string) {
  const usuario = await prisma.usuario.findUnique({
    where: { email },
    include: { empresa: true, grupo_usuario: { include: { permissoes: true } } },
  })
  if (!usuario || !usuario.ativo) {
    throw { statusCode: 401, message: 'Email ou senha invalidos' }
  }
  const senhaValida = await bcrypt.compare(senha, usuario.senha_hash)
  if (!senhaValida) {
    throw { statusCode: 401, message: 'Email ou senha invalidos' }
  }
  const payload = {
    usuario_id: usuario.id.toString(),
    empresa_id: usuario.empresa_id.toString(),
  }
  const token = signAccessToken(payload)
  const refreshToken = signRefreshToken(payload)
  return {
    token,
    refreshToken,
    usuario: { id: usuario.id.toString(), nome: usuario.nome, email: usuario.email },
    empresa: { id: usuario.empresa.id.toString(), razao_social: usuario.empresa.razao_social, nome_fantasia: usuario.empresa.nome_fantasia },
    permissoes: usuario.grupo_usuario?.permissoes.map(p => ({ modulo: p.modulo, acao: p.acao, permitido: p.permitido })) || [],
  }
}
