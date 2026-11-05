import Link from "next/link";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

/** Логотип: векторный силуэт + текстовая часть */
export default function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — home`}
      className={cn("group flex items-center gap-2.5", className)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-flat.svg"
        alt=""
        width={40}
        height={40}
        className="h-9 w-9 transition-transform duration-500 group-hover:rotate-[15deg]"
      />
      <span className="font-display text-xl font-semibold leading-none tracking-tight">
        Crazy<span className="text-berry-bright">Berries</span>
      </span>
    </Link>
  );
}
