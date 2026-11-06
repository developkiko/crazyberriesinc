"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { Button, Surface } from "@/components/ui/Button";
import { site } from "@/data/site";

/** Форма обратной связи → Telegram-бот админам + копия на почту владельца */
export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    const form = new FormData(e.currentTarget);
    if ((form.get("company") as string)?.trim()) {
      setStatus("done");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          contact: form.get("contact"),
          subject: form.get("subject"),
          message: form.get("message"),
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "");
      }
      setStatus("done");
      e.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error && err.message
          ? err.message
          : `Something went wrong. Please try again or call ${site.phone}.`
      );
    }
  }

  if (status === "done") {
    return (
      <Surface className="flex flex-col items-center gap-4 p-10 text-center">
        <CheckCircle2 className="h-14 w-14 text-green-500" />
        <h2 className="font-display text-2xl font-semibold">Message sent!</h2>
        <p className="max-w-md leading-relaxed text-fg-muted">
          Thank you for reaching out. We usually reply within one business day.
        </p>
        <Button variant="outline" size="sm" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </Surface>
    );
  }

  const inputCls =
    "rounded-xl border border-surface-border bg-surface-strong px-4 py-3 text-sm outline-none transition-colors placeholder:text-fg-muted/50 focus:border-berry-bright";

  return (
    <Surface className="p-6 sm:p-8">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Your name
            <input required name="name" autoComplete="name" placeholder="Jane Smith" className={inputCls} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Phone or e-mail
            <input
              required
              name="contact"
              placeholder="(555) 123-4567 or jane@mail.com"
              className={inputCls}
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Subject
          <select name="subject" className={inputCls} defaultValue="General question">
            <option>General question</option>
            <option>Wholesale / corporate</option>
            <option>Where to buy in NYC</option>
            <option>Feedback</option>
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Message
          <textarea
            required
            name="message"
            rows={5}
            placeholder="How can we help?"
            className={`resize-none ${inputCls}`}
          />
        </label>

        <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" />

        {status === "error" && (
          <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-500">{error}</p>
        )}

        <Button type="submit" size="lg" disabled={status === "sending"}>
          {status === "sending" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Sending…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" /> Send message
            </>
          )}
        </Button>
      </form>
    </Surface>
  );
}
