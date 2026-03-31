import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

interface Usuario { id: string; nome: string; email: string }
interface Empresa { id: string; razao_social: string; nome_fantasia: string | null }
interface Permissao { modulo: string; acao: string; permitido: boolean }

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const usuario = ref<Usuario | null>(JSON.parse(localStorage.getItem('usuario') || 'null'))
  const empresa = ref<Empresa | null>(JSON.parse(localStorage.getItem('empresa') || 'null'))
  const permissoes = ref<Permissao[]>(JSON.parse(localStorage.getItem('permissoes') || '[]'))

  const isAuthenticated = computed(() => !!token.value)

  async function login(email: string, senha: string) {
    const { data: res } = await axios.post('/api/auth/login', { email, senha })
    token.value = res.data.token
    usuario.value = res.data.usuario
    empresa.value = res.data.empresa
    permissoes.value = res.data.permissoes
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('usuario', JSON.stringify(res.data.usuario))
    localStorage.setItem('empresa', JSON.stringify(res.data.empresa))
    localStorage.setItem('permissoes', JSON.stringify(res.data.permissoes))
  }

  async function logout() {
    try { await axios.post('/api/auth/logout') } catch {}
    token.value = null
    usuario.value = null
    empresa.value = null
    permissoes.value = []
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    localStorage.removeItem('empresa')
    localStorage.removeItem('permissoes')
  }

  async function refreshToken() {
    try {
      const { data: res } = await axios.post('/api/auth/refresh')
      token.value = res.data.token
      localStorage.setItem('token', res.data.token)
      return true
    } catch {
      await logout()
      return false
    }
  }

  function can(modulo: string, acao: string): boolean {
    return permissoes.value.some(p => p.modulo === modulo && p.acao === acao && p.permitido)
  }

  return { token, usuario, empresa, permissoes, isAuthenticated, login, logout, refreshToken, can }
})
