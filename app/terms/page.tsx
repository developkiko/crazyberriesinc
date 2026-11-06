import type { Metadata } from "next";
import PolicyPage from "@/components/layout/PolicyPage";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/data/site";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description:
    "The terms for using crazyberries.vercel.app and placing request-based orders with Crazy Berries Inc. — prices confirmed by a manager, no online payment.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <PolicyPage
      title="Terms of Service"
      crumbsLabel="Terms of Service"
      intro={`The basics of using this website and placing orders with ${site.legalName}.`}
      sections={[
        {
          heading: "How ordering works",
          body: [
            <p key="1">
              This is a request-based store: the site does not process payments and
              does not charge anything. You add products to a request list and send it
              to us — our manager replies personally with the total price, delivery
              options and payment arrangements. A request is not a confirmed order
              until we agree on the terms together.
            </p>,
          ],
        },
        {
          heading: "Prices and availability",
          body: [
            <p key="1">
              Product prices are quoted by the manager at the time of your request and
              may change with market supply. Photographs and weights on product pages
              are informational; the manager confirms exact pack sizes and current
              availability in the reply.
            </p>,
          ],
        },
        {
          heading: "Use of the site",
          body: [
            <p key="1">
              The content of this site (texts, photographs, product descriptions) is
              provided for your personal, non-commercial use. Please don’t copy it in
              bulk or reuse the images commercially without our permission. The site
              is provided “as is” without warranties of uninterrupted availability.
            </p>,
          ],
        },
        {
          heading: "Food products",
          body: [
            <p key="1">
              Our products are natural dried fruits, berries, juices and
              chocolate-covered treats imported from Europe. While labels carry
              nutrition facts and ingredients, always check the packaging you receive
              for allergens and storage — and if you have a food allergy, tell the
              manager when ordering.
            </p>,
          ],
        },
        {
          heading: "Contact",
          body: [
            <p key="1">
              Any questions about these terms:{" "}
              <a className="text-berry-bright underline underline-offset-4" href={`tel:${site.phoneHref}`}>
                {site.phone}
              </a>{" "}
              · {site.email}. {site.legalName}, {site.address}.
            </p>,
          ],
        },
      ]}
    />
  );
}
