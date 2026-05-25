import { useState } from 'react'
import { useCreateAddress } from '../hooks/useAddresses'
import type { CreateAddressDto } from '../types'

interface AddressFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function AddressForm({ onSuccess, onCancel }: AddressFormProps) {
  const [form, setForm] = useState<CreateAddressDto>({
    alias: '',
    calle: '',
    numero: '',
    ciudad: '',
    provincia: '',
    codigo_postal: '',
  })
  const createMutation = useCreateAddress()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(
      form,
      {
        onSuccess: () => {
          setForm({ alias: '', calle: '', numero: '', ciudad: '', provincia: '', codigo_postal: '' })
          onSuccess?.()
        },
      },
    )
  }

  const update = (field: keyof CreateAddressDto, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value || undefined }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Alias (ej: Casa, Trabajo)"
        value={form.alias}
        onChange={(e) => update('alias', e.target.value)}
        required
        className="w-full px-4 py-2.5 bg-surface-container rounded-sm text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-rb-red"
      />
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Calle"
          value={form.calle}
          onChange={(e) => update('calle', e.target.value)}
          required
          className="flex-1 px-4 py-2.5 bg-surface-container rounded-sm text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-rb-red"
        />
        <input
          type="text"
          placeholder="Número"
          value={form.numero}
          onChange={(e) => update('numero', e.target.value)}
          required
          className="w-28 px-4 py-2.5 bg-surface-container rounded-sm text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-rb-red"
        />
      </div>
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Ciudad"
          value={form.ciudad}
          onChange={(e) => update('ciudad', e.target.value)}
          required
          className="flex-1 px-4 py-2.5 bg-surface-container rounded-sm text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-rb-red"
        />
        <input
          type="text"
          placeholder="Provincia"
          value={form.provincia}
          onChange={(e) => update('provincia', e.target.value)}
          required
          className="flex-1 px-4 py-2.5 bg-surface-container rounded-sm text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-rb-red"
        />
      </div>
      <input
        type="text"
        placeholder="Código postal"
        value={form.codigo_postal}
        onChange={(e) => update('codigo_postal', e.target.value)}
        className="w-full px-4 py-2.5 bg-surface-container rounded-sm text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-rb-red"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="bg-rb-red text-white text-sm font-sans font-bold uppercase tracking-wider px-4 py-2 rounded-sm hover:bg-rb-red-hover transition-colors disabled:opacity-50"
        >
          {createMutation.isPending ? 'Guardando...' : 'Guardar'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-sm text-on-surface-variant hover:text-on-surface">
            Cancelar
          </button>
        )}
      </div>
      {createMutation.isError && (
        <p className="text-xs text-danger">Error al guardar la dirección</p>
      )}
    </form>
  )
}
