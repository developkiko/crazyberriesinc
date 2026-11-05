import type { Metadata } from "next";
import { site } from "@/data/site";
import type { Product } from "@/types";
import { getCategory } from "@/lib/products";

export function buildMetadata({
  title,
  description,
  path = "/",
  image,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}): Metadata {
  const url = `${site.domain}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} — ${site.name}`,
      description,
      url,
      siteName: site.name,
      type: "website",
      images: [{ url: image ?? `${site.domain}/icons/icon-512.png`, width: 512, height: 512, alt: site.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${site.name}`,
      description,
    },
  };
}

export function productMetadata(product: Product): Metadata {
  const category = getCategory(product.category);
  return buildMetadata({
    title: `${product.name} — Buy Online`,
    description: `${product.short} ${category?.title ?? ""}. Unsulfured, non-GMO, imported from Europe. Order from Crazy Berries — retail & wholesale, Staten Island NY.`,
    path: `/product/${product.slug}`,
    image: `${site.domain}${product.image}`,
  });
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.legalName,
    url: site.domain,
    logo: `${site.domain}/logo.png`,
    email: site.email,
    telephone: site.phone,
    foundingDate: site.founded,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Staten Island",
      addressRegion: "NY",
      postalCode: "10304",
      addressCountry: "US",
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.domain,
  };
}

export function productJsonLd(product: Product) {
  const category = getCategory(product.category);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short,
    image: `${site.domain}${product.image}`,
    slug: product.slug,
    brand: { "@type": "Brand", name: site.name },
    category: category?.title,
    weight: product.weight,
    offers: {
      "@type": "Offer",
      url: `${site.domain}/product/${product.slug}`,
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
      // цены на сайте нет — заказ через заявку, менеджер подтверждает сумму
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "USD",
        valueAddedTaxIncluded: false,
      },
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: `${site.domain}${item.url}` } : {}),
    })),
  };
}
