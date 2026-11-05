"use client";

import { useEffect } from "react";

/** Регистрация service worker (PWA) */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch((e) => {
        console.warn("SW registration failed:", e);
      });
    }
  }, []);
  return null;
}
