import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
};

export function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-berry-bright",
        "active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
        size === "sm" && "px-3.5 py-1.5 text-sm",
        size === "md" && "px-5 py-2.5 text-sm",
        size === "lg" && "px-7 py-3.5 text-base",
        variant === "primary" &&
          "bg-berry-bright text-white shadow-lg shadow-berry-bright/25 hover:bg-berry hover:shadow-berry/30 hover:-translate-y-0.5",
        variant === "outline" &&
          "border border-surface-border bg-surface text-fg backdrop-blur-md hover:bg-surface-strong",
        variant === "ghost" && "text-fg hover:bg-surface",
        className
      )}
      {...props}
    />
  );
}

export function Badge({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-surface-border bg-surface px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-fg-muted backdrop-blur-sm",
        className
      )}
      {...props}
    />
  );
}

export function Section({
  className,
  children,
  ...props
}: ComponentProps<"section">) {
  return (
    <section className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)} {...props}>
      {children}
    </section>
  );
}

/** карточка-поверхность поверх анимированного фона */
export function Surface({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border border-surface-border bg-surface backdrop-blur-md",
        className
      )}
      {...props}
    />
  );
}
