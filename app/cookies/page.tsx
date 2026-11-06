import type { Metadata } from "next";
import PolicyPage from "@/components/layout/PolicyPage";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/data/site";

export const metadata: Metadata = buildMetadata({
  title: "Cookie Policy",
  description:
    "Crazy Berries Inc. uses no tracking cookies — only essential local browser storage for your cart and theme preference.",
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <PolicyPage
      title="Cookie Policy"
      crumbsLabel="Cookie Policy"
      intro={`The short version: ${site.legalName} sets no tracking cookies of any kind. Here is everything your browser stores when you visit us.`}
      sections={[
        {
          heading: "What we store",
          body: [
            <p key="1">
              We don&apos;t use cookies at all. The site keeps three small
              entries in your browser&apos;s local storage, and they never
              leave your device:
            </p>,
            <ul key="2" className="ml-4 list-disc">
              <li>
                <code className="rounded bg-surface px-1.5 py-0.5 text-xs">cb-cart</code> —
                the contents of your request cart, so it survives a page reload
                or an accidental close;
              </li>
              <li>
                <code className="rounded bg-surface px-1.5 py-0.5 text-xs">theme</code> —
                your light/dark/system theme preference;
              </li>
              <li>
                <code className="rounded bg-surface px-1.5 py-0.5 text-xs">cb-cookie-consent</code> —
                the fact that you&apos;ve seen this notice, so we don&apos;t
                show it again.
              </li>
            </ul>,
          ],
        },
        {
          heading: "What we don’t store",
          body: [
            <p key="1">
              No analytics, no advertising identifiers, no social media pixels,
              no cross-site tracking, no fingerprinting. We can&apos;t follow
              you around the web — the site simply has no code that would.
            </p>,
          ],
        },
        {
          heading: "Clearing it",
          body: [
            <p key="1">
              You can wipe all of the above at any time via your browser
              settings (“Clear site data” / “Local storage”). You&apos;ll get
              the cookie notice again on your next visit — that&apos;s the only
              consequence.
            </p>,
          ],
        },
        {
          heading: "Questions",
          body: [
            <p key="1">
              Write to{" "}
              <a className="text-berry-bright underline underline-offset-4" href={`mailto:${site.email}`}>
                {site.email}
              </a>{" "}
              or call {site.phone} — we answer within one business day.
            </p>,
          ],
        },
      ]}
    />
  );
}
