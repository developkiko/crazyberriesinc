import type { Metadata } from "next";
import { Section } from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import CheckoutForm from "@/components/cart/CheckoutForm";
import CartItemsList from "@/components/cart/CartItemsList";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Your Request",
  description:
    "Review your Crazy Berries request and send it to our managers — we'll reply with the total price and delivery options.",
  path: "/cart",
});

export default function CartPage() {
  return (
    <Section className="py-10">
      <Breadcrumbs items={[{ name: "Home", url: "/" }, { name: "Request" }]} />
      <Reveal>
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">Your request</h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-fg-muted">
          Prices are confirmed personally by our manager — send the list and we&apos;ll get
          back to you shortly with the total and delivery options.
        </p>
      </Reveal>

      {/* две колонки: список корзины + форма отправки заявки */}
      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <Reveal delay={60}>
          <CartItemsList />
        </Reveal>
        <Reveal delay={120}>
          <CheckoutForm />
        </Reveal>
      </div>
    </Section>
  );
}
