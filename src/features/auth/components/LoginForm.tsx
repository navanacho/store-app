import { useState } from 'react'
import { useLogin } from '../hooks/useAuth'
import { InputField } from '@/shared/components/InputField'
import { ButtonGeneric } from '@/shared/components/ButtonGeneric'

export function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const loginMutation = useLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginMutation.mutate({ username, password })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-stack-md">
      {loginMutation.isError && (
        <p className="text-data-mono text-danger text-sm">
          {loginMutation.error?.message || 'Usuario o contraseña incorrectos'}
        </p>
      )}

      <InputField
        label="Email"
        value={username}
        onChange={setUsername}
        placeholder="tu@email.com"
        required
      />

      <InputField
        label="Contraseña"
        value={password}
        onChange={setPassword}
        placeholder="••••••••"
        type="password"
        required
      />

      <ButtonGeneric
        info={loginMutation.isPending ? 'Ingresando…' : 'Ingresar'}
        type="Primary"
        submit
        disabled={loginMutation.isPending}
        extraClass="w-full mt-2"
      />
    </form>
  )
}
