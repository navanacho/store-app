import { Link } from 'react-router-dom'
import { LoginForm } from '../components/LoginForm'

export function LoginPage() {
  return (
    <div className="w-full max-w-sm bg-rb-charcoal rounded-md shadow-ink p-8">
      <h2 className="text-headline-md text-rb-bone mb-6">INICIAR SESIÓN</h2>

      <LoginForm />

      <p className="text-center text-label-caps text-rb-bone/40 mt-6">
        ¿No tenés cuenta?{' '}
        <Link to="/register" className="text-rb-red hover:underline">Registrate</Link>
      </p>
    </div>
  )
}
