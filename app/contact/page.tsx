import type { Metadata } from "next";
import { Phone, Mail, MapPin, Store } from "lucide-react";
import { Section, Surface } from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ContactForm from "@/components/layout/ContactForm";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/data/site";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us",
  description:
    "Questions, wholesale and corporate accounts — reach Crazy Berries Inc. by phone, e-mail or the contact form. Staten Island, NY.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <Section className="py-10">
      <Breadcrumbs items={[{ name: "Home", url: "/" }, { name: "Contact Us" }]} />
      <Reveal>
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">Contact us</h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-fg-muted">
          We&apos;re happy to answer questions, help with returns, or talk wholesale and
          corporate gifts.
        </p>
      </Reveal>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <Reveal delay={60}>
          <div className="flex flex-col gap-4">
            <Surface className="flex items-start gap-4 p-5">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-berry-bright" />
              <div>
                <p className="font-semibold">Phone</p>
                <a
                  href={`tel:${site.phoneHref}`}
                  className="text-sm text-fg-muted transition-colors hover:text-berry-bright"
                >
                  {site.phone}
                </a>
              </div>
            </Surface>
            <Surface className="flex items-start gap-4 p-5">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-berry-bright" />
              <div>
                <p className="font-semibold">E-mail</p>
                <a
                  href={`mailto:${site.email}`}
                  className="text-sm text-fg-muted transition-colors hover:text-berry-bright"
                >
                  {site.email}
                </a>
              </div>
            </Surface>
            <Surface className="flex items-start gap-4 p-5">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-berry-bright" />
              <div>
                <p className="font-semibold">Address</p>
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-fg-muted underline decoration-surface-border underline-offset-4 transition-colors hover:text-berry-bright"
                >
                  {site.address}
                </a>
                <p className="mt-1 text-xs text-fg-muted">Open in Google Maps ↗</p>
              </div>
            </Surface>
            <Surface className="flex items-start gap-4 p-5">
              <Store className="mt-0.5 h-5 w-5 shrink-0 text-berry-bright" />
              <div>
                <p className="font-semibold">Wholesale</p>
                <p className="text-sm leading-relaxed text-fg-muted">
                  Stores, cafés and corporate gifts — mention it in the subject and
                  we&apos;ll send our wholesale line.
                </p>
              </div>
            </Surface>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <ContactForm />
        </Reveal>
      </div>
    </Section>
  );
}
