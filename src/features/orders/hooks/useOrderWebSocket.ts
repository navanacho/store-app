import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/features/auth/store/authStore'
import { getApiBase } from '@/shared/lib/config'

// ── Tipos ────────────────────────────────────────────────────────────
type WsListener = (event: string, data: unknown) => void

// ── Singleton: WebSocket manager ─────────────────────────────────────
// Una sola conexión compartida entre todos los componentes. Se conecta
// cuando el primer componente la necesita y se cierra cuando el último
// se desmonta.
class OrderSocketManager {
  private ws: WebSocket | null = null
  private trackedOrders: Set<number> = new Set()
  private listeners: Set<WsListener> = new Set()
  private refCount = 0
  private reconnectAttempt = 0
  private readonly MAX_RETRIES = 5
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null

  private get url(): string {
    const base = getApiBase().replace(/^http/, 'ws')
    const wsUrl = `${base}/pedidos/ws`
    console.log('[WS] URL:', wsUrl)
    return wsUrl
  }

  /** Incrementa el contador de uso y abre la conexión si es la primera vez. */
  connect() {
    this.refCount++
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return
    }
    this.open()
  }

  /** Decrementa el contador; cierra la conexión si ya nadie la necesita. */
  disconnect() {
    this.refCount = Math.max(0, this.refCount - 1)
    if (this.refCount === 0) this.close()
  }

  subscribe(orderId: number) {
    if (this.trackedOrders.has(orderId)) return
    console.log('[WS] Subscribe a pedido:', orderId)
    this.trackedOrders.add(orderId)
    this.send({ action: 'subscribe-order', order_id: orderId })
  }

  unsubscribe(orderId: number) {
    if (!this.trackedOrders.has(orderId)) return
    console.log('[WS] Unsubscribe de pedido:', orderId)
    this.trackedOrders.delete(orderId)
    this.send({ action: 'unsubscribe-order', order_id: orderId })
  }

  addListener(fn: WsListener): () => void {
    this.listeners.add(fn)
    return () => { this.listeners.delete(fn) }
  }

  /** Expone los IDs trackeados para que el hook pueda hacer diff. */
  getTrackedIds(): Set<number> {
    return this.trackedOrders
  }

  // ── Privado ──────────────────────────────────────────────────────

  private open() {
    this.cleanupTimer()
    if (this.ws) {
      this.ws.onclose = null
      this.ws.onmessage = null
      this.ws.onopen = null
      if (this.ws.readyState !== WebSocket.CLOSED) this.ws.close()
    }

    console.log('[WS] Conectando a:', this.url)
    this.ws = new WebSocket(this.url)

    this.ws.onopen = () => {
      console.log('[WS] Conectado exitosamente')
      this.reconnectAttempt = 0
      // Re-suscribir todos los pedidos que se estuvieran siguiendo
      const ids = [...this.trackedOrders]
      console.log('[WS] Re-suscribiendo pedidos:', ids)
      ids.forEach((id) =>
        this.ws?.send(JSON.stringify({ action: 'subscribe-order', order_id: id })),
      )
    }

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as { event: string; data: unknown }
        console.log('[WS] Mensaje recibido:', msg.event, msg.data)
        this.listeners.forEach((l) => l(msg.event, msg.data))
      } catch {
        console.warn('[WS] Mensaje malformado:', event.data)
      }
    }

    this.ws.onclose = (e: CloseEvent) => {
      console.log(`[WS] Cerrado - codigo: ${e.code}, motivo: "${e.reason}", limpio: ${e.wasClean}`)
      // Si todavía hay interesados, reconectar con backoff
      if (this.refCount > 0) this.scheduleReconnect()
    }

    this.ws.onerror = (e: Event) => {
      console.error('[WS] Error en la conexion:', e)
    }
  }

  private close() {
    this.cleanupTimer()
    // NO limpiar trackedOrders — el onopen() los re-suscribe si hace falta.
    // Si los limpiamos acá, en StrictMode se pierden entre el unmount y remount.
    if (this.ws) {
      this.ws.onclose = null
      this.ws.onmessage = null
      this.ws.onopen = null
      this.ws.close()
      this.ws = null
    }
  }

  private send(data: unknown) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    }
  }

  private scheduleReconnect() {
    if (this.reconnectAttempt >= this.MAX_RETRIES) return
    this.reconnectAttempt++
    const delay = Math.min(1000 * 2 ** (this.reconnectAttempt - 1), 16_000)
    this.reconnectTimer = setTimeout(() => {
      if (this.refCount > 0) this.open()
    }, delay)
  }

  private cleanupTimer() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }
}

// Módulo singleton
const socketManager = new OrderSocketManager()

// ── Hook público ─────────────────────────────────────────────────────
/**
 * Conecta al WebSocket de pedidos y se suscribe a los `orderIds` indicados.
 *
 * - Cuando llega un `PEDIDO_ESTADO`, actualiza la cache de React Query
 *   tanto del detalle (`['orders', id]`) como invalida la lista (`['orders']`)
 *   y el historial (`['orders', id, 'history']`).
 * - Si no se pasa ningún `orderIds`, igual se conecta (para recibir eventos
 *   de suscripciones hechas desde otros hooks).
 *
 * @example
 * // En OrderDetailPage
 * useOrderWebSocket([orderId])
 *
 * @example
 * // En OrdersPage
 * const { data: orders } = useOrders()
 * useOrderWebSocket(orders?.map(o => o.id))
 */
export function useOrderWebSocket(orderIds?: number[]) {
  const queryClient = useQueryClient()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  // Conexión + listener de eventos (una sola vez por ciclo de vida)
  useEffect(() => {
    if (!isAuthenticated) return

    console.log('[WS Hook] Montando, conectando...')
    socketManager.connect()

    const removeListener = socketManager.addListener((event, data) => {
      console.log('[WS Hook] Evento recibido:', event, data)
      if (event === 'PEDIDO_ESTADO' && data && typeof data === 'object' && 'id' in data) {
        const orderData = data as { id: number }
        console.log('[WS Hook] Actualizando cache para pedido:', orderData.id)
        // Actualizar cache del detalle sin hacer un nuevo request
        queryClient.setQueryData(['orders', orderData.id], data)
        // Forzar refetch del historial (podría haber cambiado)
        queryClient.invalidateQueries({ queryKey: ['orders', orderData.id, 'history'] })
        // Forzar refetch de la lista por si cambió el estado
        queryClient.invalidateQueries({ queryKey: ['orders'] })
      }
    })

    return () => {
      console.log('[WS Hook] Desmontando, desconectando...')
      removeListener()
      socketManager.disconnect()
    }
  }, [isAuthenticated, queryClient])

  // Sincronizar suscripciones: en cada cambio, calculamos el diff
  // contra lo que ya está trackeado en el singleton.
  useEffect(() => {
    if (!isAuthenticated) return

    const ids = new Set(orderIds ?? [])
    console.log('[WS Hook] Sincronizando suscripciones:', [...ids])

    // Dar de baja los que sobran
    socketManager.getTrackedIds().forEach((id) => {
      if (!ids.has(id)) socketManager.unsubscribe(id)
    })
    // Dar de alta los nuevos
    ids.forEach((id) => {
      if (!socketManager.getTrackedIds().has(id)) socketManager.subscribe(id)
    })
  }, [orderIds, isAuthenticated])
}
