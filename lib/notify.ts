/**
 * Уведомления сайта: ВСЕ формы и заказы уходят в Telegram-бот админам
 * (@crazyberries_bot) + копия на e-mail владельца, если настроена почта.
 * Почта опциональна: нет ключа — просто пропускаем, Telegram остаётся основным каналом.
 */

const TG_API = "https://api.telegram.org";

async function sendTelegram(text: string): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = (process.env.TELEGRAM_CHAT_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!token || chatIds.length === 0) {
    // без конфигурации молча пропускаем, но помечаем в логе сервера
    console.warn("[notify] TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_IDS не настроены — уведомление не отправлено");
    return { ok: false, error: "telegram-not-configured" };
  }

  const results = await Promise.allSettled(
    chatIds.map((chatId) =>
      fetch(`${TG_API}/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      })
    )
  );

  const failed = results.filter((r) => r.status === "rejected" || (r.status === "fulfilled" && !r.value.ok));
  return failed.length === results.length
    ? { ok: false, error: "all-failed" }
    : { ok: true };
}

async function sendEmail(subject: string, html: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return; // почта опциональна — основной канал Telegram
  const from = process.env.MAIL_FROM ?? "CrazyBerries Site <onboarding@resend.dev>";
  const to = process.env.MAIL_TO ?? "CrazyBerriesInc@gmail.com";
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject, html }),
    });
  } catch (e) {
    console.error("[notify] email не отправлен:", e);
  }
}

/** единая точка отправки: TG + копия на почту */
export async function notify(
  subject: string,
  lines: string[]
): Promise<{ ok: boolean; error?: string }> {
  const text = `<b>🍓 ${subject}</b>\n\n${lines.join("\n")}`;
  const tg = await sendTelegram(text);
  await sendEmail(subject, lines.join("<br>\n"));
  return tg;
}

export function escapeTg(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
