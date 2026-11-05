import type { Metadata } from "next";
import { Section } from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import CategoryCard from "@/components/catalog/CategoryCard";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Products — Dried Berries, Juices, Fruits & Chocolate",
  description:
    "Browse the full Crazy Berries collection: rare dried berries, cold-pressed juices, old-world dried fruits and dark chocolate-covered treats. Unsulfured, non-GMO, shipped across the US.",
  path: "/catalog",
});

export default function CatalogPage() {
  return (
    <Section className="py-10">
      <Breadcrumbs items={[{ name: "Home", url: "/" }, { name: "Products" }]} />
      <Reveal>
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">Products</h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-fg-muted">
          Four families of rare European goodness — {products.length} products in total.
          Everything is unsulfured and free of preservatives.
        </p>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((c, i) => (
          <Reveal key={c.slug} delay={i * 70}>
            <CategoryCard
              category={c}
              count={products.filter((p) => p.category === c.slug).length}
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
