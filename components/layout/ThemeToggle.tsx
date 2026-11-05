"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

/** Переключатель темы: светлая / тёмная / системная (авто по браузеру/ОС) */
export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const options = [
    { key: "light", icon: Sun, label: "Light" },
    { key: "system", icon: Monitor, label: "System" },
    { key: "dark", icon: Moon, label: "Dark" },
  ] as const;

  const current = mounted ? theme : undefined;
  const CurrentIcon = current === "dark" ? Moon : current === "system" ? Monitor : Sun;

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        aria-label="Toggle theme"
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-surface-border bg-surface text-fg backdrop-blur-md transition-transform hover:scale-105 active:scale-95"
        onClick={() => setOpen((o) => !o)}
      >
        {mounted ? (
          <CurrentIcon className="h-[18px] w-[18px]" />
        ) : (
          <Sun className="h-[18px] w-[18px]" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 flex flex-col gap-1 rounded-2xl border border-surface-border bg-surface-strong p-1.5 shadow-xl backdrop-blur-xl">
          {options.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => {
                setTheme(key);
                setOpen(false);
              }}
              className={cn(
                "flex cursor-pointer items-center gap-2.5 rounded-xl px-3.5 py-2 text-sm transition-colors",
                current === key
                  ? "bg-berry-bright/15 text-berry-bright font-medium"
                  : "text-fg hover:bg-surface"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
