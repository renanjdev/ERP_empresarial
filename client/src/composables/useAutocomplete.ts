import { ref } from 'vue'
import { api } from './useApi'

export function useAutocomplete(endpoint: string) {
  const items = ref<any[]>([])
  const loading = ref(false)
  let timeout: ReturnType<typeof setTimeout>

  function search(event: { query: string }) {
    clearTimeout(timeout)
    timeout = setTimeout(async () => {
      loading.value = true
      try {
        const { data: res } = await api.get(endpoint, { params: { q: event.query } })
        items.value = res.data || []
      } catch { items.value = [] }
      finally { loading.value = false }
    }, 300)
  }

  return { items, loading, search }
}
