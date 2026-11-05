"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2, Phone } from "lucide-react";
import { Button, Surface } from "@/components/ui/Button";
import { useCart } from "@/lib/cart-store";
import { site } from "@/data/site";

/**
 * Форма оформления заказа-заявки (без оплаты): имя + контакт + комментарий.
 * Уходит в Telegram-бот админам + копия на почту владельца.
 * Менеджер отвечает с итоговой ценой и условиями доставки.
 */
export default function CheckoutForm() {
  const { items, clear } = useCart();
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const positions = items.length;
  const totalPieces = items.reduce((n, i) => n + i.qty, 0);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (positions === 0) return;
    setStatus("sending");
    setError("");

    const form = new FormData(e.currentTarget);
    // простая ловушка спама: скрытое поле должно остаться пустым
    if ((form.get("company") as string)?.trim()) {
      setStatus("done");
      clear();
      return;
    }

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          contact: form.get("contact"),
          message: form.get("message"),
          items: items.map((i) => ({ slug: i.slug, name: i.name, weight: i.weight, qty: i.qty })),
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("done");
      clear();
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Something went wrong. Please try again or call us."
      );
    }
  }

  if (status === "done") {
    return (
      <Surface className="flex flex-col items-center gap-4 p-10 text-center">
        <CheckCircle2 className="h-14 w-14 text-green-500" />
        <h2 className="font-display text-2xl font-semibold">Request sent!</h2>
        <p className="max-w-md leading-relaxed text-fg-muted">
          Thank you. Our manager will contact you shortly with the <strong>total price</strong>{" "}
          for your request and delivery options.
        </p>
        <p className="text-sm text-fg-muted">
          In a hurry? Call us:{" "}
          <a href={`tel:${site.phoneHref}`} className="font-medium text-berry-bright">
            {site.phone}
          </a>
        </p>
      </Surface>
    );
  }

  return (
    <Surface className="p-6 sm:p-8">
      <h2 className="font-display text-2xl font-semibold">Checkout</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">
        No online payment — send the request, and our manager will reply with the total price
        and delivery options.
      </p>

      <ul className="my-5 flex flex-wrap gap-2 text-sm">
        <li className="rounded-full bg-berry-bright/10 px-3 py-1 font-medium text-berry-bright">
          {positions} {positions === 1 ? "position" : "positions"}
        </li>
        <li className="rounded-full bg-berry-bright/10 px-3 py-1 font-medium text-berry-bright">
          {totalPieces} pcs total
        </li>
      </ul>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Your name
          <input
            required
            name="name"
            autoComplete="name"
            placeholder="Jane Smith"
            className="rounded-xl border border-surface-border bg-surface-strong px-4 py-3 text-sm outline-none transition-colors placeholder:text-fg-muted/50 focus:border-berry-bright"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Phone or e-mail
          <input
            required
            name="contact"
            placeholder="(555) 123-4567 or jane@mail.com"
            className="rounded-xl border border-surface-border bg-surface-strong px-4 py-3 text-sm outline-none transition-colors placeholder:text-fg-muted/50 focus:border-berry-bright"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Comment (optional)
          <textarea
            name="message"
            rows={3}
            placeholder="Delivery city, preferred time to call, gift wrapping…"
            className="resize-none rounded-xl border border-surface-border bg-surface-strong px-4 py-3 text-sm outline-none transition-colors placeholder:text-fg-muted/50 focus:border-berry-bright"
          />
        </label>

        {/* honeypot от спама */}
        <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" />

        {status === "error" && (
          <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-500">{error}</p>
        )}

        <Button type="submit" size="lg" disabled={status === "sending" || positions === 0}>
          {status === "sending" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Sending…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" /> Send request
            </>
          )}
        </Button>

        <p className="flex items-center justify-center gap-1.5 text-xs text-fg-muted">
          <Phone className="h-3 w-3" /> or call {site.phone} — we&apos;re happy to help
        </p>
      </form>
    </Surface>
  );
}
