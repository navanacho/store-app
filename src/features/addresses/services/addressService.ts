import { apiClient } from '@/shared/lib/axios'
import type { Address, CreateAddressDto } from '../types'

interface ListResponse<T> {
  data: T[]
  total: number
}

export async function getAddresses(): Promise<Address[]> {
  const { data } = await apiClient.get<ListResponse<Address>>('/direcciones')
  return data.data
}

export async function createAddress(dto: CreateAddressDto): Promise<Address> {
  const { data } = await apiClient.post<Address>('/direcciones', dto)
  return data
}
