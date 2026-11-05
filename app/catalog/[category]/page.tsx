import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ProductGrid from "@/components/catalog/ProductGrid";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import { getCategory } from "@/lib/products";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return buildMetadata({
    title: `${category.title} — Buy Online`,
    description: `${category.description} Order retail or wholesale from Staten Island, NY — shipped across the US.`,
    path: `/catalog/${category.slug}`,
    image: `https://crazyberries.vercel.app${category.image}`,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const items = products.filter((p) => p.category === slug);
  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Products", url: "/catalog" },
    { name: category.title },
  ];

  return (
    <Section className="py-10">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <Reveal>
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">{category.title}</h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-fg-muted">{category.description}</p>
        <p className="mt-2 text-sm text-fg-muted">
          {items.length} {items.length === 1 ? "product" : "products"}
        </p>
      </Reveal>

      <div className="mt-10">
        <ProductGrid products={items} />
      </div>
    </Section>
  );
}
