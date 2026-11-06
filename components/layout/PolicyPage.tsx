import type { ReactNode } from "react";
import { Section, Surface } from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export interface PolicySection {
  heading: string;
  body: ReactNode[];
}

/** Общий каркас юридических страниц (Privacy / Terms / Shipping) */
export default function PolicyPage({
  title,
  crumbsLabel,
  intro,
  sections,
}: {
  title: string;
  crumbsLabel: string;
  intro: string;
  sections: PolicySection[];
}) {
  return (
    <Section className="py-10">
      <Breadcrumbs items={[{ name: "Home", url: "/" }, { name: crumbsLabel }]} />
      <Reveal>
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">{title}</h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-fg-muted">{intro}</p>
      </Reveal>

      <Reveal delay={80}>
        <Surface className="mt-8 flex max-w-3xl flex-col gap-8 p-6 leading-relaxed sm:p-8">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="mb-2 text-lg font-semibold">{s.heading}</h2>
              <div className="flex flex-col gap-3 text-sm text-fg-muted">{s.body}</div>
            </section>
          ))}
        </Surface>
      </Reveal>
    </Section>
  );
}
