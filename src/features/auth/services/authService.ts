import { apiClient } from '@/shared/lib/axios'
import type { LoginCredentials, RegisterDto, User } from '../types'

export async function loginService(credentials: LoginCredentials): Promise<void> {
  const params = new URLSearchParams()
  params.append('username', credentials.username)
  params.append('password', credentials.password)
  await apiClient.post('/auth/token', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}

export async function registerService(dto: RegisterDto): Promise<User> {
  const { data } = await apiClient.post<User>('/auth/register', dto)
  return data
}

export async function getMeService(): Promise<User> {
  const { data } = await apiClient.get<User>('/auth/me')
  return data
}

export async function logoutService(): Promise<void> {
  await apiClient.post('/auth/logout')
}
