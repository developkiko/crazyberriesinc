"use client";

import { useEffect, useRef } from "react";

/**
 * Анимированный фон на всех страницах.
 *
 * Логика (дёшево, GPU-only): единственное анимируемое свойство — transform.
 *  1. выбираем случайный угол (0–2π), случайную дистанцию 60–140px
 *     и случайную длительность 3–10 с;
 *  2. ставим CSS-переменные --bg-dur/--bx/--by → срабатывает transition
 *     с плавным разгоном и плавным торможением (cubic-bezier в globals.css);
 *  3. на transitionend — новый угол, новая длительность, снова движение.
 *
 * Слой больше вьюпорта (inset: -25%), смещение клампится в «окно» ±15%,
 * поэтому края не показываются никогда. prefers-reduced-motion отключает анимацию.
 */
export default function AnimatedBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    let bx = 0;
    let by = 0;
    const MAX = 0.15; // доля от размера слоя (200% вьюпорта) — окно ±15%

    const step = () => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 80; // px
      const dur = 3 + Math.random() * 7; // 3–10 c
      const targetX = bx + Math.cos(angle) * dist;
      const targetY = by + Math.sin(angle) * dist;
      // кламп в окно: у края принудительно уводим к центру
      const clamp = (v: number) => Math.max(-MAX, Math.min(MAX, v));
      bx = clamp(targetX) === targetX ? targetX : targetX * 0.5;
      by = clamp(targetY) === targetY ? targetY : targetY * 0.5;
      if (Math.abs(bx) > MAX * 200) bx = bx * 0.5;
      if (Math.abs(by) > MAX * 200) by = by * 0.5;

      el.style.setProperty("--bg-dur", `${dur.toFixed(2)}s`);
      // следующий кадр — чтобы смена цели запустила transition заново
      requestAnimationFrame(() => {
        el.style.setProperty("--bx", `${bx.toFixed(1)}px`);
        el.style.setProperty("--by", `${by.toFixed(1)}px`);
      });
    };

    el.addEventListener("transitionend", step, { passive: true });
    // первый запуск после мгновенной паузы
    const t = setTimeout(step, 400);

    return () => {
      el.removeEventListener("transitionend", step);
      clearTimeout(t);
    };
  }, []);

  return <div ref={ref} aria-hidden className="bg-anim" />;
}
