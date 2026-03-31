import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const sidebarAberta = ref(true)
  const loadingGlobal = ref(false)
  function toggleSidebar() { sidebarAberta.value = !sidebarAberta.value }
  return { sidebarAberta, loadingGlobal, toggleSidebar }
})
