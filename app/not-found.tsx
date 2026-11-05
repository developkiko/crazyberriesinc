import Link from "next/link";
import { Section, Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Section className="flex min-h-[60dvh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-8xl font-semibold text-berry-bright">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold">
        This berry rolled away…
      </h1>
      <p className="mt-3 max-w-md text-fg-muted">
        The page you&apos;re looking for doesn&apos;t exist — but our berries do, and
        they&apos;re glorious.
      </p>
      <Link href="/catalog" className="mt-8">
        <Button size="lg">Browse the catalog</Button>
      </Link>
    </Section>
  );
}
