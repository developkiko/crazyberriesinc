import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { categories } from "@/data/categories";
import { products } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: `${site.domain}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site.domain}/catalog`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.domain}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${site.domain}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${site.domain}/cart`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site.domain}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site.domain}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site.domain}/shipping`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site.domain}/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    ...categories.map((c) => ({
      url: `${site.domain}/catalog/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: `${site.domain}/product/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
