export interface Address {
  id: number
  usuario_id: number
  alias: string
  calle: string
  numero: string
  piso_dpto?: string
  ciudad: string
  provincia: string
  codigo_postal?: string
  latitud?: number
  longitud?: number
  referencias?: string
  es_principal: boolean
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface CreateAddressDto {
  alias: string
  calle: string
  numero: string
  piso_dpto?: string
  ciudad: string
  provincia: string
  codigo_postal?: string
  latitud?: number
  longitud?: number
  referencias?: string
  es_principal?: boolean
}
