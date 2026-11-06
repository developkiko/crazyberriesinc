"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { Button, Surface } from "@/components/ui/Button";
import { useCart, cartCount } from "@/lib/cart-store";

/** Полный список корзины для страницы /cart (вторая колонка рядом с формой).
 *  Цен нет — это заказ-заявка, итог подтвердит менеджер. */
export default function CartItemsList() {
  const { items, setQty, remove, clear } = useCart();
  const positions = items.length;
  const pieces = cartCount(items);

  if (positions === 0) {
    return (
      <Surface className="flex flex-col items-center gap-4 p-12 text-center">
        <ShoppingBag className="h-12 w-12 text-fg-muted opacity-40" />
        <h2 className="font-display text-2xl font-semibold">Your cart is empty</h2>
        <p className="max-w-sm leading-relaxed text-fg-muted">
          Add some rare berries, fruits or chocolate-covered treats — your body
          will thank you.
        </p>
        <Link href="/catalog" className="mt-2">
          <Button variant="outline">Browse products</Button>
        </Link>
      </Surface>
    );
  }

  return (
    <Surface className="p-5 sm:p-6">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 font-display text-2xl font-semibold">
          <ShoppingBag className="h-5 w-5 text-berry-bright" />
          Your items
          <span className="text-sm font-normal text-fg-muted">
            · {positions} {positions === 1 ? "position" : "positions"} · {pieces} pcs
          </span>
        </h2>
        <button
          onClick={clear}
          className="cursor-pointer text-xs font-medium text-fg-muted underline decoration-surface-border underline-offset-4 transition-colors hover:text-red-500"
        >
          Clear all
        </button>
      </header>

      <ul className="flex flex-col divide-y divide-surface-border">
        {items.map((item) => (
          <li key={item.slug} className="flex gap-4 py-4 first:pt-0 last:pb-0">
            <Link
              href={`/product/${item.slug}`}
              className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-surface-border"
            >
              <Image src={item.image} alt={item.imageAlt} fill sizes="80px" className="object-cover" />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col">
              <Link
                href={`/product/${item.slug}`}
                className="font-medium leading-snug transition-colors hover:text-berry-bright"
              >
                {item.name}
              </Link>
              {item.weight && <span className="mt-0.5 text-sm text-fg-muted">{item.weight}</span>}
              <span className="mt-1 text-xs text-fg-muted">
                Price confirmed by manager · qty × {item.qty}
              </span>

              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="flex items-center gap-1 rounded-full border border-surface-border bg-surface-strong">
                  <button
                    aria-label="Decrease quantity"
                    onClick={() => setQty(item.slug, item.qty - 1)}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-surface"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-7 text-center text-sm font-semibold">{item.qty}</span>
                  <button
                    aria-label="Increase quantity"
                    onClick={() => setQty(item.slug, item.qty + 1)}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-surface"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <button
                  aria-label={`Remove ${item.name}`}
                  onClick={() => remove(item.slug)}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-red-500/10 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-4 border-t border-surface-border pt-4 text-xs leading-relaxed text-fg-muted">
        No online payment on this site — send the request and our manager will
        reply with the total price and delivery options.
      </p>
    </Surface>
  );
}
