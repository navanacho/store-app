import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '../types'

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find((i) => i.id === item.id)
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity ?? 1) } : i,
            ),
          })
        } else {
          set({ items: [...get().items, { ...item, quantity: item.quantity ?? 1 }] })
        }
      },
      removeItem: (productId) => set({ items: get().items.filter((i) => i.id !== productId) }),
      updateQuantity: (productId, quantity) =>
        set({
          items: quantity <= 0
            ? get().items.filter((i) => i.id !== productId)
            : get().items.map((i) => (i.id === productId ? { ...i, quantity } : i)),
        }),
      clearCart: () => set({ items: [] }),
    }),
    { name: 'rb-cart-storage' },
  ),
)
