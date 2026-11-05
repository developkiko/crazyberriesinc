"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/lib/cart-store";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

/** Мини-корзина: slide-over справа. Суммы нет — это заказ-заявка, цену подтвердит менеджер. */
export default function CartDrawer() {
  const { items, drawerOpen, setDrawerOpen, setQty, remove } = useCart();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setDrawerOpen]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const positions = items.length;
  const totalItems = items.reduce((n, i) => n + i.qty, 0);

  return (
    <div
      aria-hidden={!drawerOpen}
      className={`fixed inset-0 z-[90] ${drawerOpen ? "" : "pointer-events-none"}`}
    >
      {/* затемнение */}
      <div
        onClick={() => setDrawerOpen(false)}
        className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          drawerOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* панель */}
      <aside
        role="dialog"
        aria-label="Your cart"
        className={`absolute right-0 top-0 flex h-dvh w-full max-w-md flex-col border-l border-surface-border bg-surface-strong backdrop-blur-2xl transition-transform duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-surface-border px-5 py-4">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <ShoppingBag className="h-5 w-5 text-berry-bright" />
            Your request
            {positions > 0 && (
              <span className="text-sm font-normal text-fg-muted">
                · {positions} {positions === 1 ? "item" : "items"} ({totalItems} pcs)
              </span>
            )}
          </h2>
          <button
            aria-label="Close cart"
            onClick={() => setDrawerOpen(false)}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-surface"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {positions === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-fg-muted">
              <ShoppingBag className="h-10 w-10 opacity-30" />
              <p>Your cart is empty.</p>
              <p className="text-sm">Add some rare berries — your body will thank you.</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => setDrawerOpen(false)}
              >
                <Link href="/catalog">Browse products</Link>
              </Button>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {items.map((item) => (
                <li
                  key={item.slug}
                  className="flex gap-3 rounded-2xl border border-surface-border bg-surface p-3"
                >
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link
                      href={`/product/${item.slug}`}
                      onClick={() => setDrawerOpen(false)}
                      className="truncate text-sm font-medium hover:text-berry-bright"
                    >
                      {item.name}
                    </Link>
                    {item.weight && (
                      <span className="text-xs text-fg-muted">{item.weight}</span>
                    )}
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-full border border-surface-border">
                        <button
                          aria-label="Decrease quantity"
                          onClick={() => setQty(item.slug, item.qty - 1)}
                          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-surface"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-medium">{item.qty}</span>
                        <button
                          aria-label="Increase quantity"
                          onClick={() => setQty(item.slug, item.qty + 1)}
                          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-surface"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        aria-label={`Remove ${item.name}`}
                        onClick={() => remove(item.slug)}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-fg-muted transition-colors hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {positions > 0 && (
          <footer className="border-t border-surface-border px-5 py-4">
            <p className="mb-3 text-xs leading-relaxed text-fg-muted">
              No online payment — send a request and our manager will reply with the total
              price and delivery options shortly.
            </p>
            <Link href="/cart" onClick={() => setDrawerOpen(false)} className="block">
              <Button size="lg" className="w-full">
                Checkout request
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </footer>
        )}
      </aside>
    </div>
  );
}
