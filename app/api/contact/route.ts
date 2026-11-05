import { NextResponse } from "next/server";
import { notify, escapeTg } from "@/lib/notify";

/**
 * Форма обратной связи (страница Contact Us).
 * Уведомление → Telegram-бот админам + копия на почту владельца.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name ?? "").slice(0, 120);
    const contact = String(body.contact ?? "").slice(0, 160);
    const subject = String(body.subject ?? "General question").slice(0, 120);
    const message = String(body.message ?? "").slice(0, 2000);

    if (!name.trim() || !contact.trim() || !message.trim()) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const lines = [
      `<b>👤 Name:</b> ${escapeTg(name)}`,
      `<b>📞 Contact:</b> ${escapeTg(contact)}`,
      `<b>📌 Subject:</b> ${escapeTg(subject)}`,
      "",
      `<b>💬 Message:</b>\n${escapeTg(message)}`,
    ];

    await notify("New message ✉️", lines);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[contact]", e);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
