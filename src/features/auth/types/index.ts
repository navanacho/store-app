export interface User {
  id: number
  username: string
  full_name: string
  email: string
  disabled: boolean
  roles: { rol_code: string; expires_at?: string; created_at: string }[]
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterDto {
  username: string
  email: string
  password: string
  full_name: string
}
