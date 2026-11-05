import { products } from "@/data/products";
import { categories, categoryBySlug } from "@/data/categories";
import type { Product, Category, CategorySlug } from "@/types";

export { categories, categoryBySlug };

export function getAllProducts(): Product[] {
  return products;
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(slug: CategorySlug | string): Product[] {
  return products.filter((p) => p.category === slug);
}

export function getCategory(slug: string): Category | undefined {
  return categoryBySlug(slug);
}

/** похожие товары: та же категория, при возможности та же ягода */
export function getRelated(product: Product, limit = 4): Product[] {
  const sameBerry = products.filter(
    (p) => p.slug !== product.slug && p.category === product.category && p.berry === product.berry
  );
  const sameCategory = products.filter(
    (p) => p.slug !== product.slug && p.category === product.category && p.berry !== product.berry
  );
  return [...sameBerry, ...sameCategory].slice(0, limit);
}
