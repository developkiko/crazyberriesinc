import type { Metadata } from "next";
import { Section, Surface } from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/data/site";

export const metadata: Metadata = buildMetadata({
  title: "About Us",
  description:
    "Crazy Berries Inc. imports rare European dried berries, fruits, juices and chocolate-covered treats to the US since 2016. Unsulfured, non-GMO. Family-run from Staten Island, NY.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <Section className="py-10">
      <Breadcrumbs items={[{ name: "Home", url: "/" }, { name: "About Us" }]} />
      <Reveal>
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">About us</h1>
      </Reveal>

      <div className="mt-8 grid max-w-4xl flex-col gap-5">
        <Reveal delay={60}>
          <Surface className="p-7 leading-relaxed sm:p-9">
            <p className="text-lg">
              A message from the purveyors of fine fruits.
            </p>
            <p className="mt-4">
              <strong>Crazy Berries</strong> sells a variety of dried berries you won&apos;t
              find on every shelf — strawberries, lingonberries, raspberries, black
              currants, aronia, seaberry and many more. Everything is lightly sweetened,
              non-GMO and unsulfured: just berries and a touch of apple juice concentrate.
            </p>
            <p className="mt-4">
              Imported from Europe and dried without sulfur or preservatives, in a variety
              you have never seen or tasted before. Dried berries have been found to
              support vision, clear arteries, strengthen blood vessels, enhance memory and
              help with weight control — they are one of the richest sources of
              antioxidants found in any fruit.
            </p>
            <p className="mt-4">
              They taste great right out of the package and are ideal for mixing into
              cereals, salads and oatmeal. Enjoy the wholesome taste of summer with our
              perfect variety — <em>go CRAZY!</em>
            </p>
          </Surface>
        </Reveal>

        <Reveal delay={120}>
          <Surface className="p-7 sm:p-9">
            <h2 className="font-display text-2xl font-semibold">Where to find us</h2>
            <p className="mt-3 leading-relaxed text-fg-muted">
              You can find our products in many specialty stores in New York City, and we
              are expanding nationwide. <strong>Wholesale and corporate accounts are
              welcome</strong> — reach out with all your berry needs.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-fg-muted">
              {site.legalName} · {site.address}
              <br />
              Tel.: {site.phone} · E-mail: {site.email}
            </p>
          </Surface>
        </Reveal>
      </div>
    </Section>
  );
}
