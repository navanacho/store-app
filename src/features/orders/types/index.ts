export interface OrderDetailItem {
  id: number
  pedido_id: number
  producto_id: number
  producto_nombre: string
  cantidad: number
  producto_precio_unitario: number
  subtotal: number
}

export interface OrderStatusHistory {
  id: number
  pedido_id: number
  usuario_cambio_id?: number
  fecha_cambio: string
  estado_codigo?: string
}

export interface Order {
  id: number
  usuario_id: number
  estado_id: number
  estado_codigo: string
  subtotal: number
  costo_envio: number
  total: number
  direccion_entrega_id?: number
  forma_pago_id?: number
  notas_cliente?: string
  created_at: string
  updated_at: string
  deleted_at?: string
  detalles: OrderDetailItem[]
}

export interface CreateOrderDto {
  direccion_entrega_id: number
  forma_pago_id: number
  notas_cliente?: string
  detalles: { producto_id: number; cantidad: number }[]
}
