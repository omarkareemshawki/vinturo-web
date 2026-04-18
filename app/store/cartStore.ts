import { create } from 'zustand';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addToCart: (item) => set(state => {
    const existing = state.items.find(i => i.id === item.id);
    if (existing) return { items: state.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i) };
    return { items: [...state.items, item] };
  }),
  removeFromCart: (id) => set(state => ({ items: state.items.filter(i => i.id !== id) })),
  clearCart: () => set({ items: [] }),
  total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}));