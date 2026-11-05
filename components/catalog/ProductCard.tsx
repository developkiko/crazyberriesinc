import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { Badge, Surface } from "@/components/ui/Button";
import AddToCartButton from "@/components/cart/AddToCartButton";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Surface className="group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-berry/10">
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-[3/4] overflow-hidden"
      >
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {product.weight && (
          <span className="absolute bottom-2 left-2 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
            {product.weight}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-[15px] font-semibold leading-snug transition-colors group-hover:text-berry-bright">
            {product.name}
          </h3>
        </Link>
        <p className="line-clamp-2 text-[13px] leading-relaxed text-fg-muted">{product.short}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
          {product.tags.slice(0, 2).map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
        <AddToCartButton product={product} size="sm" full />
      </div>
    </Surface>
  );
}
