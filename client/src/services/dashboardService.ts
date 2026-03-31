import { api } from '@/composables/useApi'

export const dashboardService = {
  resumo: () => api.get('/dashboard/resumo'),
}
