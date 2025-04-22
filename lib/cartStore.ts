import { create } from 'zustand';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  total: number;
}

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  addToCart: (item: Omit<CartItem, 'quantity' | 'total'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  isDrawerOpen: false,
  addToCart: (item) => set((state) => {
    const existing = state.items.find((i) => i.id === item.id);
    let newItems;
    if (existing) {
      newItems = state.items.map((i) =>
        i.id === item.id
          ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.price }
          : i
      );
    } else {
      newItems = [
        ...state.items,
        { ...item, quantity: 1, total: item.price },
      ];
    }
    return { items: newItems, isDrawerOpen: true };
  }),
  removeFromCart: (id) => set((state) => ({
    items: state.items.filter((i) => i.id !== id),
  })),
  updateQuantity: (id, quantity) => set((state) => ({
    items: state.items.map((i) =>
      i.id === id ? { ...i, quantity, total: i.price * quantity } : i
    ),
  })),
  clearCart: () => set({ items: [] }),
  openCartDrawer: () => set({ isDrawerOpen: true }),
  closeCartDrawer: () => set({ isDrawerOpen: false }),
}));