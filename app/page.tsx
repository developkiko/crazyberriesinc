import Link from "next/link";
import { ArrowRight, Leaf, ShieldCheck, Plane, Store } from "lucide-react";
import { Section, Surface, Button } from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import CategoryCard from "@/components/catalog/CategoryCard";
import ProductCard from "@/components/catalog/ProductCard";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { site } from "@/data/site";

export default function HomePage() {
  const featured = [
    products.find((p) => p.slug === "organic-aronia-berries-35-oz100g")!,
    products.find((p) => p.slug === "organic-wild-blueberries-35-oz100g")!,
    products.find((p) => p.slug === "strawberry-chocolate")!,
    products.find((p) => p.slug === "organic-aronia-berry-juice-720ml")!,
  ];

  const countByCategory = (slug: string) => products.filter((p) => p.category === slug).length;

  return (
    <>
      {/* ---------- HERO ---------- */}
      <Section className="flex min-h-[70dvh] flex-col items-center justify-center py-16 text-center">
        <Reveal>
          <p className="mb-4 inline-block rounded-full border border-surface-border bg-surface px-4 py-1.5 text-sm text-fg-muted backdrop-blur-md">
            🍓 Imported from Europe since {site.founded}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            Berries you won&apos;t find
            <span className="text-berry-bright"> anywhere else</span>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">
            Aronia, wild lingonberry, seaberry, wild blueberry — unsulfured, non-GMO,
            lightly sweetened. Dried, cold-pressed and chocolate-covered.
          </p>
        </Reveal>
        <Reveal delay={240} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link href="/catalog">
            <Button size="lg">
              Explore products <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline">
              Wholesale & gifts
            </Button>
          </Link>
        </Reveal>
      </Section>

      {/* ---------- КАТЕГОРИИ ---------- */}
      <Section className="py-12">
        <Reveal>
          <h2 className="mb-8 font-display text-3xl font-semibold sm:text-4xl">
            Our collection
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c, i) => (
            <Reveal key={c.slug} delay={i * 70}>
              <CategoryCard category={c} count={countByCategory(c.slug)} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------- FEATURED ---------- */}
      <Section className="py-12">
        <Reveal>
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">Fan favorites</h2>
            <Link
              href="/catalog"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-berry-bright"
            >
              View all
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
          {featured.map((p, i) => (
            <Reveal key={p.slug} delay={i * 70}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------- ПОЧЕМУ МЫ ---------- */}
      <Section className="py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: ShieldCheck,
              title: "Unsulfured & Non-GMO",
              text: "No sulfur dioxide, no preservatives. Sweetened only with apple juice concentrate.",
            },
            {
              icon: Plane,
              title: "True European Import",
              text: "Berries grown and dried in Europe — the varieties America simply doesn't grow.",
            },
            {
              icon: Leaf,
              title: "Antioxidant Powerhouse",
              text: "Aronia, seaberry and wild blueberry top every antioxidant chart. Snack with purpose.",
            },
            {
              icon: Store,
              title: "Retail & Wholesale",
              text: "Find us in specialty stores across NYC — or order directly, anywhere in the US.",
            },
          ].map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 70}>
              <Surface className="h-full p-5 transition-transform duration-300 hover:-translate-y-1">
                <Icon className="h-7 w-7 text-berry-bright" />
                <h3 className="mt-3 font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{text}</p>
              </Surface>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------- CTA ---------- */}
      <Section className="py-12">
        <Reveal>
          <Surface className="relative overflow-hidden p-8 text-center sm:p-14">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold leading-tight sm:text-4xl">
              Snack without guilt. <span className="text-berry-bright">Go crazy.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-fg-muted">
              Dried berries improve vision, clear arteries, strengthen blood vessels and
              enhance memory — while tasting like summer.
            </p>
            <Link href="/catalog" className="mt-7 inline-block">
              <Button size="lg">
                Start snacking <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </Surface>
        </Reveal>
      </Section>
    </>
  );
}
