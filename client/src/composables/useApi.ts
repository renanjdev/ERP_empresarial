import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const api = axios.create({ baseURL: '/api', withCredentials: true })

let isRefreshing = false
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = []

function processQueue(error: any, token: string | null) {
  failedQueue.forEach(({ resolve, reject }) => { if (error) reject(error); else resolve(token!) })
  failedQueue = []
}

api.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.token) config.headers.Authorization = `Bearer ${auth.token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (err) => {
    const originalRequest = err.config
    if (err.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        })
      }
      originalRequest._retry = true
      isRefreshing = true
      const auth = useAuthStore()
      const success = await auth.refreshToken()
      isRefreshing = false
      if (success) {
        processQueue(null, auth.token)
        originalRequest.headers.Authorization = `Bearer ${auth.token}`
        return api(originalRequest)
      } else {
        processQueue(err, null)
        router.push('/login')
        return Promise.reject(err)
      }
    }
    return Promise.reject(err)
  }
)

export { api }
export function useApi() { return api }
