import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'

export function useForm<T>(submitFn: (data: T) => Promise<any>) {
  const loading = ref(false)
  const errors = ref<Record<string, string>>({})
  const toast = useToast()

  async function submit(data: T) {
    loading.value = true
    errors.value = {}
    try {
      const result = await submitFn(data)
      toast.add({ severity: 'success', summary: 'Sucesso', detail: result.data?.message || 'Operacao realizada', life: 3000 })
      return result
    } catch (err: any) {
      const res = err.response?.data
      if (res?.data?.errors) {
        for (const e of res.data.errors) {
          errors.value[e.path?.[0] || e.field || 'general'] = e.message
        }
      }
      toast.add({ severity: 'error', summary: 'Erro', detail: res?.message || 'Erro ao processar', life: 5000 })
      throw err
    } finally {
      loading.value = false
    }
  }

  return { loading, errors, submit }
}
