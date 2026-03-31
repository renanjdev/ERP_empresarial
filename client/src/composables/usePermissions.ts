import { useAuthStore } from '@/stores/auth'
export function usePermissions() {
  const auth = useAuthStore()
  return { can: (modulo: string, acao: string) => auth.can(modulo, acao) }
}
