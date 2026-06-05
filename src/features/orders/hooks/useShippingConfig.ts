import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/lib/axios'

interface ShippingConfig {
  delivery: number
  pickup: number
}

export function useShippingConfig() {
  return useQuery<ShippingConfig>({
    queryKey: ['shipping-config'],
    queryFn: async () => {
      const { data } = await apiClient.get<ShippingConfig>('/pedidos/costo-envio')
      return data
    },
    staleTime: 5 * 60_000,
  })
}
