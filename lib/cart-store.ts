"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/types";

interface CartState {
  items: CartItem[];
  drawerOpen: boolean;
  add: (product: Product, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  setDrawerOpen: (open: boolean) => void;
}

/**
 * Мини-корзина-заявка: цены на сайте нет, считаем только позиции и количество.
 * persist → localStorage, корзина переживает перезагрузку и офлайн.
 */
export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      drawerOpen: false,
      add: (product, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.slug === product.slug);
          const items = existing
            ? s.items.map((i) =>
                i.slug === product.slug ? { ...i, qty: Math.min(99, i.qty + qty) } : i
              )
            : [
                ...s.items,
                {
                  slug: product.slug,
                  name: product.name,
                  weight: product.weight,
                  image: product.image,
                  imageAlt: product.imageAlt,
                  qty,
                },
              ];
          return { items, drawerOpen: true };
        }),
      remove: (slug) => set((s) => ({ items: s.items.filter((i) => i.slug !== slug) })),
      setQty: (slug, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.slug !== slug)
              : s.items.map((i) => (i.slug === slug ? { ...i, qty: Math.min(99, qty) } : i)),
        })),
      clear: () => set({ items: [] }),
      setDrawerOpen: (open) => set({ drawerOpen: open }),
    }),
    {
      name: "cb-cart",
      partialize: (s) => ({ items: s.items }), // drawerOpen не персистим
    }
  )
);

export const cartCount = (items: CartItem[]) => items.reduce((n, i) => n + i.qty, 0);
