import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getOrders, getOrderById, createOrder, cancelOrder, getOrderHistory } from '../services/orderService'
import type { CreateOrderDto } from '../types'
import { extractErrorMessage, toast } from '@/shared/lib/toast'

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
  })
}

export function useOrderById(id: number | undefined) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => getOrderById(id!),
    enabled: id != null && id > 0,
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateOrderDto) => createOrder(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export function useCancelOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => cancelOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      toast.success('Pedido cancelado')
    },
    onError: (err) =>
      toast.error('No se pudo cancelar el pedido', extractErrorMessage(err)),
  })
}

export function useOrderHistory(id: number | undefined) {
  return useQuery({
    queryKey: ['orders', id, 'history'],
    queryFn: () => getOrderHistory(id!),
    enabled: id != null && id > 0,
  })
}
