import { useState } from 'react'
import { useRegister } from '../hooks/useAuth'
import { InputField } from '@/shared/components/InputField'
import { ButtonGeneric } from '@/shared/components/ButtonGeneric'

export function RegisterForm() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const registerMutation = useRegister()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    registerMutation.mutate({
      full_name: fullName,
      email,
      username,
      password,
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-stack-md">
      {registerMutation.isError && (
        <p className="text-data-mono text-danger text-sm">
          {registerMutation.error?.message || 'Error al registrarse'}
        </p>
      )}

      <InputField
        label="Nombre completo"
        value={fullName}
        onChange={setFullName}
        placeholder="Juan Pérez"
        required
      />

      <InputField
        label="Email"
        value={email}
        onChange={setEmail}
        placeholder="tu@email.com"
        type="email"
        required
      />

      <InputField
        label="Usuario"
        value={username}
        onChange={setUsername}
        placeholder="juancito"
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
        info={registerMutation.isPending ? 'Registrando…' : 'Registrarse'}
        type="Primary"
        submit
        disabled={registerMutation.isPending}
        extraClass="w-full mt-2"
      />
    </form>
  )
}
