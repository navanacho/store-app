import { MapPin } from 'lucide-react'
import type { Address } from '../types'

interface AddressCardProps {
  address: Address
  selected?: boolean
  onSelect?: (id: number) => void
}

export function AddressCard({ address, selected, onSelect }: AddressCardProps) {
  return (
    <div
      onClick={() => onSelect?.(address.id)}
      className={`flex items-start gap-3 p-4 rounded-sm border cursor-pointer transition-colors ${
        selected
          ? 'border-rb-red bg-rb-red-soft'
          : 'border-outline-variant/30 bg-surface hover:bg-surface-container'
      }`}
    >
      <MapPin className="w-5 h-5 text-on-surface-variant shrink-0 mt-0.5" />
      <div>
        <p className="font-sans font-medium text-on-surface">{address.alias}</p>
        <p className="text-sm text-on-surface-variant">{address.calle} {address.numero}</p>
        <p className="text-sm text-on-surface-variant">{address.ciudad}, {address.provincia}</p>
      </div>
    </div>
  )
}
