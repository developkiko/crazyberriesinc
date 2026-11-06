"use client";

import { usePathname } from "next/navigation";
import { useCart, cartCount } from "@/lib/cart-store";
import { ShoppingBag } from "lucide-react";

/** Кнопка корзины в хедере: иконка + бейдж количества позиций.
 *  На странице /cart самой корзины прячем — там полный список товаров. */
export default function CartButton() {
  const pathname = usePathname();
  const items = useCart((s) => s.items);
  const setDrawerOpen = useCart((s) => s.setDrawerOpen);
  const count = cartCount(items);

  if (pathname === "/cart") return null;

  return (
    <button
      aria-label={`Cart, ${count} items`}
      onClick={() => setDrawerOpen(true)}
      className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-surface-border bg-surface text-fg backdrop-blur-md transition-transform hover:scale-105 active:scale-95"
    >
      <ShoppingBag className="h-[18px] w-[18px]" />
      {count > 0 && (
        <span
          key={count}
          className="absolute -right-1 -top-1 flex h-5 min-w-5 animate-pop items-center justify-center rounded-full bg-berry-bright px-1 text-[11px] font-bold text-white"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
