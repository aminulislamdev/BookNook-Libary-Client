import Link from "next/link";
import { BookOpen, Home, Library, Compass } from "lucide-react";
import Container from "@/components/ui/Container";

export default function NotFound() {
  return (
    <section className="bg-paper py-20 sm:py-28 min-h-[75vh] flex items-center">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          {/* Library / Book Illustration */}
          <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-brand-soft border border-line shadow-sm text-brand-soft-foreground">
            <BookOpen className="h-12 w-12" aria-hidden="true" />
            <span className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand-surface text-white text-xs font-bold shadow">
              <Compass className="h-4 w-4" />
            </span>
          </div>

          {/* Large "404" typography */}
          <p className="mt-8 font-display text-7xl font-extrabold tracking-tight text-brand/20 sm:text-8xl select-none">
            404
          </p>

          {/* Heading */}
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Oops! This Page Is Lost in the Library
          </h1>

          {/* Friendly Description */}
          <p className="mt-4 text-base leading-7 text-muted max-w-md mx-auto">
            The page you are looking for might have been misplaced or returned to a different shelf. Let&apos;s guide you back to our main catalog.
          </p>

          {/* ✅ Back to Home Button - Link দিয়ে স্টাইল করা হয়েছে */}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-surface px-6 text-base font-semibold text-white shadow-sm transition hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              <Home className="h-4 w-4" aria-hidden="true" />
              Back to Home
            </Link>

            <Link
              href="/books"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-line bg-paper px-6 text-base font-semibold text-ink transition hover:border-brand/40 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              <Library className="h-4 w-4" aria-hidden="true" />
              Browse Books
            </Link>
          </div>

          <p className="mt-8 text-sm text-muted">
            Looking for a specific title?{" "}
            <Link href="/books" className="font-semibold text-brand hover:underline">
              Search the library
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}