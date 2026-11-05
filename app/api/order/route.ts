import { NextResponse } from "next/server";
import { notify, escapeTg } from "@/lib/notify";

interface OrderItem {
  slug: string;
  name: string;
  weight?: string;
  qty: number;
}

/**
 * Оформление заказа-заявки из мини-корзины.
 * Все уведомления → Telegram-бот админам + копия на почту владельца.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name ?? "").slice(0, 120);
    const contact = String(body.contact ?? "").slice(0, 160);
    const message = String(body.message ?? "").slice(0, 1500);
    const items: OrderItem[] = Array.isArray(body.items) ? body.items.slice(0, 60) : [];

    if (!name.trim() || !contact.trim() || items.length === 0) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const lines = [
      `<b>👤 Name:</b> ${escapeTg(name)}`,
      `<b>📞 Contact:</b> ${escapeTg(contact)}`,
      message ? `<b>💬 Comment:</b>\n${escapeTg(message)}` : "",
      "",
      "<b>🛒 Order:</b>",
      ...items.map(
        (i) =>
          `• ${escapeTg(i.name)}${i.weight ? ` (${escapeTg(i.weight)})` : ""} — <b>x${i.qty}</b>`
      ),
      "",
      `Positions: ${items.length} · Pieces: ${items.reduce((n, i) => n + (Number(i.qty) || 0), 0)}`,
      "<i>Price is not set online — manager will confirm the total.</i>",
    ].filter(Boolean);

    const result = await notify("New order request 🌟", lines);

    if (!result.ok && result.error === "telegram-not-configured") {
      console.error("[order] уведомления не настроены (TELEGRAM_CHAT_IDS пуст?)");
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[order]", e);
    return NextResponse.json({ error: "Failed to send request" }, { status: 500 });
  }
}
