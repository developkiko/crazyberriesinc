import Link from "next/link";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

/** Логотип: эмблема на «пластине» + текстовая часть */
export default function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — home`}
      className={cn("group flex items-center gap-3", className)}
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-surface-border bg-surface-strong shadow-sm backdrop-blur-md transition-transform duration-500 group-hover:rotate-[8deg] group-hover:scale-105 sm:h-[52px] sm:w-[52px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt=""
          width={52}
          height={52}
          className="h-full w-full object-contain"
        />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl font-semibold tracking-tight sm:text-[26px]">
          Crazy<span className="text-berry-bright">Berries</span>
        </span>
        <span className="mt-1 hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-fg-muted sm:block">
          Inc. · Fine Foods
        </span>
      </span>
    </Link>
  );
}
