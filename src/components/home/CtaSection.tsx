import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import Container from "@/components/ui/Container";

export default function CtaSection() {
  return (
    <section className="bg-paper py-20 sm:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] bg-brand-surface px-6 py-16 text-center shadow-[0_30px_80px_-45px_rgba(15,118,110,0.65)] sm:px-12 sm:py-20">
          <BookOpen
            aria-hidden="true"
            className="absolute -right-10 -top-10 h-56 w-56 text-white/10"
            strokeWidth={1}
          />
          <BookOpen
            aria-hidden="true"
            className="absolute -bottom-12 -left-10 h-48 w-48 text-white/10"
            strokeWidth={1}
          />

          <div className="relative mx-auto max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-100">
              A shelf of your own
            </p>
            <h2 className="mt-4 text-balance font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Your Next Great Read Awaits
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-7 text-teal-50/90">
              Browse the full collection, borrow something new, or add a book
              you think other readers should find.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

              {/* ✅ Explore Books বাটন */}
              <Link
                href="/books"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-base font-semibold text-brand-dark shadow-sm transition hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface"
              >
                Explore Books
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>

              {/* ✅ Add a Book বাটন */}
              <Link
                href="/add-book"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/30 bg-transparent px-6 text-base font-semibold text-white transition hover:border-white/60 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface"
              >
                Add a Book
              </Link>

            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}