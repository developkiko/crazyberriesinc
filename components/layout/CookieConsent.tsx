"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

const CONSENT_KEY = "cb-cookie-consent";

/**
 * Уведомление о куках при первом входе.
 * Сайт не использует трекинговые куки — только localStorage (корзина, тема,
 * память согласия), о чём и сообщаем. Согласие сохраняется локально.
 */
export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      if (!localStorage.getItem(CONSENT_KEY)) {
        // небольшая пауза, чтобы не выскакивало в лицо при загрузке
        const t = setTimeout(() => setShow(true), 900);
        return () => clearTimeout(t);
      }
    } catch {
      // localStorage недоступен — просто не показываем
    }
  }, []);

  const onAccept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, "1");
    } catch {}
    setShow(false);
  };

  if (!mounted || !show) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie notice"
      className="fixed inset-x-4 bottom-4 z-[80] sm:inset-x-auto sm:bottom-6 sm:left-1/2 sm:w-[min(32rem,calc(100vw-3rem))] sm:-translate-x-1/2"
    >
      <div className="flex flex-col gap-3 rounded-3xl border border-surface-border bg-surface-strong p-5 shadow-2xl backdrop-blur-2xl animate-cookie-in sm:flex-row sm:items-center">
        <Cookie className="h-8 w-8 shrink-0 text-berry-bright" />
        <p className="text-sm leading-relaxed text-fg-muted">
          We use only essential local browser storage — your cart and theme
          preference. <strong className="text-fg">No tracking, no ads, no
          analytics cookies.</strong>{" "}
          <Link
            href="/cookies"
            className="text-berry-bright underline underline-offset-4"
          >
            Cookie Policy
          </Link>
        </p>
        <button
          onClick={onAccept}
          className="shrink-0 cursor-pointer rounded-full bg-berry-bright px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 active:scale-95"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}
