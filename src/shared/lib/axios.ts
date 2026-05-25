import axios, { type AxiosError, type AxiosResponse } from 'axios'
import { getApiBase } from './config'

export const apiClient = axios.create({
  baseURL: getApiBase(),
  withCredentials: true,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      import('@/features/auth/store/authStore').then(({ useAuthStore }) => {
        useAuthStore.getState().logout()
      })
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default apiClient
