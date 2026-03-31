import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificacoesStore = defineStore('notificacoes', () => {
  const notificacoes = ref<any[]>([])
  const contadorNovas = ref(0)
  async function buscarNovas() { contadorNovas.value = 0 }
  return { notificacoes, contadorNovas, buscarNovas }
})
