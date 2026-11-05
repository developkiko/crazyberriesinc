import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/types";
import { Surface } from "@/components/ui/Button";

export default function CategoryCard({ category, count }: { category: Category; count: number }) {
  return (
    <Link href={`/catalog/${category.slug}`} className="group">
      <Surface className="flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-berry/10">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={category.image}
            alt={category.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1.5 p-4">
          <h3 className="font-display text-lg font-semibold leading-tight transition-colors group-hover:text-berry-bright">
            {category.title}
          </h3>
          <p className="line-clamp-2 text-[13px] leading-relaxed text-fg-muted">{category.short}</p>
          <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-berry-bright">
            {count} products
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </Surface>
    </Link>
  );
}
