import { api } from '@/composables/useApi'

const BASE = '/centros_custos'

export const centrosCustoService = {
  listar: (params?: Record<string, any>) => api.get(`${BASE}/index`, { params }),
  buscar: (id: string) => api.get(`${BASE}/visualizar/${id}`),
  criar: (data: any) => api.post(`${BASE}/adicionar`, data),
  editar: (id: string, data: any) => api.post(`${BASE}/editar/${id}`, data),
  excluir: (id: string) => api.post(`${BASE}/excluir/${id}`),
  autocomplete: (q: string) => api.get(`${BASE}/buscaCentrosCustos`, { params: { q } }),
}
