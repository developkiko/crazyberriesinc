import { Section } from "@/components/ui/Button";

export const metadata = { title: "Offline" };

export default function OfflinePage() {
  return (
    <Section className="flex min-h-[60dvh] flex-col items-center justify-center py-20 text-center">
      <p className="text-6xl">🍓</p>
      <h1 className="mt-4 font-display text-3xl font-semibold">You&apos;re offline</h1>
      <p className="mt-3 max-w-md text-fg-muted">
        No internet connection. Pages you&apos;ve already visited are available from
        cache — everything else will load once you&apos;re back online.
      </p>
    </Section>
  );
}
