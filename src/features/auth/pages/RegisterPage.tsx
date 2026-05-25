import { Link } from 'react-router-dom'
import { RegisterForm } from '../components/RegisterForm'

export function RegisterPage() {
  return (
    <div className="w-full max-w-sm bg-rb-charcoal rounded-md shadow-ink p-8">
      <h2 className="text-headline-md text-rb-bone mb-6">CREAR CUENTA</h2>

      <RegisterForm />

      <p className="text-center text-label-caps text-rb-bone/40 mt-6">
        ¿Ya tenés cuenta?{' '}
        <Link to="/login" className="text-rb-red hover:underline">Ingresá</Link>
      </p>
    </div>
  )
}
