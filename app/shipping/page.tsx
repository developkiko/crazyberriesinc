import type { Metadata } from "next";
import PolicyPage from "@/components/layout/PolicyPage";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/data/site";

export const metadata: Metadata = buildMetadata({
  title: "Shipping & Returns",
  description:
    "Shipping across the US from Staten Island, NY and our returns policy for perishable natural products — Crazy Berries Inc.",
  path: "/shipping",
});

export default function ShippingPage() {
  return (
    <PolicyPage
      title="Shipping & Returns"
      crumbsLabel="Shipping & Returns"
      intro={`How your order travels from ${site.address} to your door — and what to do on the rare occasion something goes wrong.`}
      sections={[
        {
          heading: "Where we ship",
          body: [
            <p key="1">
              We ship across the United States from Staten Island, NY. Local delivery
              in NYC and pickup can often be arranged — mention your borough or
              preferred pickup time in the order comment and the manager will offer
              the best option.
            </p>,
          ],
        },
        {
          heading: "Costs and timing",
          body: [
            <p key="1">
              Shipping cost and delivery time depend on your location and the size of
              the request — the manager includes exact figures in the reply with your
              total price. Small parcel orders typically arrive within a few business
              days after confirmation.
            </p>,
          ],
        },
        {
          heading: "Packaging",
          body: [
            <p key="1">
              Dried fruits and berries are sealed to keep them fresh; juices are
              packed to survive the road. In hot months we may hold chocolate-covered
              products for the fastest possible transit — melt-resistant packing is
              used whenever the weather demands it.
            </p>,
          ],
        },
        {
          heading: "Returns and refunds",
          body: [
            <p key="1">
              Our products are food and therefore perishable, so we can’t accept
              returns of opened items. If something arrives damaged, wrong or not
              fresh — photograph it and tell us within 48 hours of delivery. We will
              replace the item or refund it, your choice.
            </p>,
          ],
        },
        {
          heading: "Questions",
          body: [
            <p key="1">
              Call{" "}
              <a className="text-berry-bright underline underline-offset-4" href={`tel:${site.phoneHref}`}>
                {site.phone}
              </a>{" "}
              or write to {site.email} — we answer within one business day.
            </p>,
          ],
        },
      ]}
    />
  );
}
