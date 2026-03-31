import { api } from '@/composables/useApi'

const BASE = '/empresas'

export const empresasService = {
  visualizar: () => api.get(`${BASE}/visualizar`),
  editar: (data: any) => api.post(`${BASE}/editar`, data),
}
