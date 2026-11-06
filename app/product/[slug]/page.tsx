import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Snowflake, Wheat } from "lucide-react";
import { Badge, Section, Surface } from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import AddToCartButton from "@/components/cart/AddToCartButton";
import ProductGrid from "@/components/catalog/ProductGrid";
import NutritionTable from "@/components/product/NutritionTable";
import JsonLd from "@/components/seo/JsonLd";
import { getProduct, getRelated, getCategory } from "@/lib/products";
import { productMetadata, productJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { products } from "@/data/products";
import { nutrition } from "@/data/nutrition";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return productMetadata(product);
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const related = getRelated(product);
  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Products", url: "/catalog" },
    ...(category
      ? [{ name: category.title, url: `/catalog/${category.slug}` }]
      : []),
    { name: product.name },
  ];

  return (
    <Section className="py-10">
      <JsonLd
        data={[productJsonLd(product), breadcrumbJsonLd(crumbs)]}
      />
      <Breadcrumbs items={crumbs} />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
        {/* фото */}
        <Reveal>
          <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-card)] border border-surface-border shadow-lg">
            <Image
              src={product.image}
              alt={product.imageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
          {(nutrition[slug] || product.nutritionImage) && (
            <details className="group mt-4 rounded-2xl border border-surface-border bg-surface backdrop-blur-md">
              <summary className="cursor-pointer select-none px-5 py-3.5 text-sm font-medium transition-colors hover:text-berry-bright">
                Nutrition facts
              </summary>
              <div className="px-5 pb-5">
                {nutrition[slug] ? (
                  <NutritionTable facts={nutrition[slug]} />
                ) : (
                  // фолбэк: этикетку не удалось распознать — показываем фото
                  <div className="relative aspect-[2/3] w-full max-w-xs overflow-hidden">
                    <Image
                      src={product.nutritionImage!}
                      alt={`${product.name} — nutrition facts`}
                      fill
                      sizes="(max-width: 320px) 100vw, 320px"
                      className="object-contain"
                    />
                  </div>
                )}
              </div>
            </details>
          )}
        </Reveal>

        {/* инфо */}
        <Reveal delay={80}>
          <div className="flex flex-wrap gap-1.5">
            {product.tags.map((t) => (
              <Badge key={t} className="border-berry-bright/25 text-berry-bright">{t}</Badge>
            ))}
          </div>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">
            {product.name}
          </h1>
          {product.weight && <p className="mt-2 text-fg-muted">{product.weight}</p>}
          <p className="mt-5 text-lg leading-relaxed text-fg-muted">{product.short}</p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <AddToCartButton product={product} size="lg" />
            <Link
              href={`/catalog/${product.category}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-fg-muted transition-colors hover:text-berry-bright"
            >
              <ArrowLeft className="h-4 w-4" /> All {category?.title.toLowerCase()}
            </Link>
          </div>

          {/* описание */}
          <div className="mt-9 flex flex-col gap-4 leading-relaxed">
            {product.description.map((paragraph, i) => (
              <p key={i} className="whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>

          {/* состав и хранение */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {product.ingredients && (
              <Surface className="p-5">
                <h2 className="flex items-center gap-2 font-semibold">
                  <Wheat className="h-5 w-5 text-berry-bright" /> Ingredients
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  {product.ingredients}
                </p>
              </Surface>
            )}
            {product.storage && (
              <Surface className="p-5">
                <h2 className="flex items-center gap-2 font-semibold">
                  <Snowflake className="h-5 w-5 text-berry-bright" /> Storage
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{product.storage}</p>
              </Surface>
            )}
          </div>
        </Reveal>
      </div>

      {/* похожие */}
      {related.length > 0 && (
        <div className="mt-16">
          <Reveal>
            <div className="mb-7 flex items-end justify-between">
              <h2 className="font-display text-2xl font-semibold sm:text-3xl">
                You may also like
              </h2>
              <Link
                href={`/catalog/${product.category}`}
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-berry-bright"
              >
                More like this
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
          <ProductGrid products={related} />
        </div>
      )}
    </Section>
  );
}
