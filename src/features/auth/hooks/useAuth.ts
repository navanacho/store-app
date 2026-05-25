import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { loginService, registerService, getMeService, logoutService } from '../services/authService'
import type { LoginCredentials, RegisterDto } from '../types'

export function useLogin() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => loginService(credentials),
    onSuccess: async () => {
      const user = await getMeService()
      login(user)
      queryClient.invalidateQueries()
      navigate('/')
    },
  })
}

export function useRegister() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (dto: RegisterDto) => registerService(dto),
    onSuccess: (user) => {
      login(user)
      navigate('/')
    },
  })
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => logoutService(),
    onSuccess: () => {
      logout()
      queryClient.clear()
      window.location.href = '/'
    },
  })
}

export function useCurrentUser() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: getMeService,
    enabled: isAuthenticated,
    retry: false,
    staleTime: 5 * 60_000,
  })
}
