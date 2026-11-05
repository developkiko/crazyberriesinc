import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs({
  items,
}: {
  items: { name: string; url?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-sm">
      {items.map((item, i) => (
        <span key={item.name} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-fg-muted" />}
          {item.url ? (
            <Link href={item.url} className="text-fg-muted transition-colors hover:text-berry-bright">
              {item.name}
            </Link>
          ) : (
            <span className="font-medium">{item.name}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
