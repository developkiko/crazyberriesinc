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
        className="logo-emblem mt-[3px] h-[100px] w-[100px] shrink-0 self-start group-hover:animate-[logo-rock_1.4s_ease-in-out_infinite]"
      />
      <span className="font-display text-xl font-semibold leading-none tracking-tight sm:text-[26px]">
        Crazy<span className="text-berry-bright">Berries</span>
      </span>
    </Link>
  );
}
