import { useNotificacoesStore } from '@/stores/notificacoes'
export function useNotifications() {
  const store = useNotificacoesStore()
  return { notificacoes: store.notificacoes, contadorNovas: store.contadorNovas, buscarNovas: store.buscarNovas }
}
