import { useState } from 'react'
import { useAddresses } from '../hooks/useAddresses'
import { AddressCard } from '../components/AddressCard'
import { AddressForm } from '../components/AddressForm'
import { LoadingSpinner } from '@/shared/components/LoadingSpinner'
import { PageHeader } from '@/shared/components/PageHeader'
import { ButtonGeneric } from '@/shared/components/ButtonGeneric'
import { MapPin, Plus } from 'lucide-react'

export function AddressesPage() {
  const { data: addresses, isLoading } = useAddresses()
  const [showForm, setShowForm] = useState(false)

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="flex flex-col gap-stack-lg max-w-3xl mx-auto px-4 py-8">
      <PageHeader
        title="Mis direcciones"
        subtitle="Gestioná tus direcciones de entrega."
        action={
          <ButtonGeneric
            info={<><Plus size={16} aria-hidden="true" /> {showForm ? 'Cancelar' : 'Agregar'}</>}
            onClick={() => setShowForm(!showForm)}
          />
        }
      />

      {showForm && (
        <div className="mb-6">
          <AddressForm onSuccess={() => setShowForm(false)} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {!addresses?.length ? (
        <div className="flex flex-col items-center gap-4 py-16 text-on-surface-variant">
          <MapPin className="w-12 h-12" />
          <p>No tenés direcciones guardadas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <AddressCard key={addr.id} address={addr} />
          ))}
        </div>
      )}
    </div>
  )
}
