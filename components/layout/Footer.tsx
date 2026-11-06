import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { site } from "@/data/site";
import { categories } from "@/data/categories";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-surface-border bg-surface backdrop-blur-md">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        {/* бренд + контакты */}
        <div className="text-sm">
          <p className="font-display text-2xl font-semibold">
            Crazy<span className="text-berry-bright">Berries</span>
          </p>
          <p className="mt-3 max-w-xs leading-relaxed text-fg-muted">
            Rare European berries, fruits, juices and chocolate-covered treats.
            Unsulfured. Non-GMO. Wildly good.
          </p>

          <ul className="mt-5 flex flex-col gap-2.5">
            <li>
              <a
                href={`tel:${site.phoneHref}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-berry-bright"
              >
                <Phone className="h-4 w-4" /> {site.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-berry-bright"
              >
                <Mail className="h-4 w-4" /> {site.email}
              </a>
            </li>
            <li>
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-start gap-2 text-fg-muted transition-colors hover:text-berry-bright"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {site.address}
              </a>
            </li>
          </ul>
          <p className="mt-4 text-xs text-fg-muted">
            Wholesale & corporate accounts welcome.
          </p>
        </div>

        <nav aria-label="Products" className="text-sm">
          <p className="mb-3 font-semibold uppercase tracking-wider text-fg-muted">Products</p>
          <ul className="flex flex-col gap-2">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/catalog/${c.slug}`}
                  className="transition-colors hover:text-berry-bright"
                >
                  {c.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/catalog" className="transition-colors hover:text-berry-bright">
                All products
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Policies" className="text-sm">
          <p className="mb-3 font-semibold uppercase tracking-wider text-fg-muted">Policies</p>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="/privacy" className="transition-colors hover:text-berry-bright">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="transition-colors hover:text-berry-bright">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/shipping" className="transition-colors hover:text-berry-bright">
                Shipping & Returns
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-surface-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-fg-muted sm:flex-row sm:px-6">
          <span>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </span>
          <span>Imported from Europe · Staten Island, NY</span>
        </div>
      </div>
    </footer>
  );
}
