import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAddresses, createAddress } from '../services/addressService'
import type { CreateAddressDto } from '../types'

export function useAddresses() {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: getAddresses,
  })
}

export function useCreateAddress() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateAddressDto) => createAddress(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    },
  })
}
