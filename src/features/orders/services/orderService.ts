import { apiClient } from '@/shared/lib/axios'
import type { Order, CreateOrderDto, OrderStatusHistory } from '../types'

interface ListResponse<T> {
  data: T[]
  total: number
}

export async function getOrders(): Promise<Order[]> {
  const { data } = await apiClient.get<ListResponse<Order>>('/pedidos')
  return data.data
}

export async function getOrderById(id: number): Promise<Order> {
  const { data } = await apiClient.get<Order>(`/pedidos/${id}`)
  return data
}

export async function createOrder(dto: CreateOrderDto): Promise<Order> {
  const { data } = await apiClient.post<Order>('/pedidos', dto)
  return data
}

export async function cancelOrder(id: number): Promise<void> {
  await apiClient.post(`/pedidos/${id}/cancelar`)
}

export async function getOrderHistory(id: number): Promise<OrderStatusHistory[]> {
  const { data } = await apiClient.get<OrderStatusHistory[]>(`/pedidos/${id}/historial`)
  return data
}
