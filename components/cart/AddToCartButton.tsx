"use client";

import { useCart } from "@/lib/cart-store";
import { Check, ShoppingBag } from "lucide-react";
import type { Product } from "@/types";
import { Button } from "@/components/ui/Button";

export default function AddToCartButton({
  product,
  size = "md",
  full = false,
}: {
  product: Product;
  size?: "sm" | "md" | "lg";
  full?: boolean;
}) {
  const add = useCart((s) => s.add);
  const inCart = useCart((s) => s.items.some((i) => i.slug === product.slug));

  return (
    <Button
      size={size}
      variant={inCart ? "outline" : "primary"}
      className={full ? "w-full" : undefined}
      onClick={() => add(product)}
    >
      {inCart ? (
        <>
          <Check className="h-4 w-4 text-berry-bright" /> In request — add more
        </>
      ) : (
        <>
          <ShoppingBag className="h-4 w-4" /> Add to request
        </>
      )}
    </Button>
  );
}
