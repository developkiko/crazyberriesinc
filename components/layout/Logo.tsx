import Link from "next/link";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

/** Логотип: цветной SVG-знак + текстовая часть.
 *  Знак крупнее шапки и «торчит» под ней, но не выше её:
 *  контейнер растянут на высоту шапки, знак прижат к верху с минимальным отступом. */
export default function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — home`}
      className={cn("group relative flex h-full items-center gap-3", className)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.svg"
        alt=""
        className="mt-[3px] h-[76px] w-[76px] shrink-0 self-start transition-transform duration-500 group-hover:rotate-[10deg] group-hover:scale-105"
      />
      <span className="font-display text-xl font-semibold leading-none tracking-tight sm:text-[26px]">
        Crazy<span className="text-berry-bright">Berries</span>
      </span>
    </Link>
  );
}
