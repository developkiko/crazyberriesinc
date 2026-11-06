import type { Metadata } from "next";
import PolicyPage from "@/components/layout/PolicyPage";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/data/site";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How Crazy Berries Inc. collects, uses and protects the little data you share with us — request-based orders, no tracking, no analytics.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      crumbsLabel="Privacy Policy"
      intro={`How we handle your information at ${site.legalName}. Short version: we collect the bare minimum, we never sell it, and we don't track you.`}
      sections={[
        {
          heading: "What we collect",
          body: [
            <p key="1">
              This site works on a request basis: there is no online checkout and no
              payment information is ever collected. When you send an order request or
              a contact message, we receive only what you type into the form — your
              name, your phone number or e-mail, and your comment or product list.
            </p>,
            <p key="2">
              Your cart and your theme preference are stored locally in your own
              browser (localStorage) so the site remembers them between visits. This
              data never leaves your device until you press “Send”.
            </p>,
          ],
        },
        {
          heading: "How we use it",
          body: [
            <p key="1">
              Submitted forms are forwarded to our managers through our internal
              notification channels (Telegram and e-mail) so we can reply to you with
              the total price, delivery options, or an answer to your question. That
              is the only use.
            </p>,
            <p key="2">
              We do not send marketing e-mails, we do not add you to any lists, and we
              do not share or sell your information to third parties.
            </p>,
          ],
        },
        {
          heading: "No tracking, no analytics",
          body: [
            <p key="1">
              The site runs no third-party analytics, advertising pixels or social
              media trackers, and sets no marketing cookies. We cannot and do not
              profile you across other websites.
            </p>,
          ],
        },
        {
          heading: "Data retention and your rights",
          body: [
            <p key="1">
              We keep your request only as long as needed to serve you and to keep
              basic business records. To review or delete anything you have sent us,
              e-mail{" "}
              <a className="text-berry-bright underline underline-offset-4" href={`mailto:${site.email}`}>
                {site.email}
              </a>{" "}
              and we will take care of it.
            </p>,
          ],
        },
        {
          heading: "Contact",
          body: [
            <p key="1">
              Questions about this policy? Call{" "}
              <a className="text-berry-bright underline underline-offset-4" href={`tel:${site.phoneHref}`}>
                {site.phone}
              </a>{" "}
              or write to {site.email}. {site.legalName}, {site.address}.
            </p>,
          ],
        },
      ]}
    />
  );
}
