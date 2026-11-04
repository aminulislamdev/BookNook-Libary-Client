"use client";

import { useRouter } from "next/navigation";
import { BookPlus, Sparkles } from "lucide-react";
import AuthGate from "@/components/shared/AuthGate";
import BookForm from "@/components/books/BookForm";
import Container from "@/components/ui/Container";
import { authClient } from "@/lib/auth-client";

function AddBookContent() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  if (!user) return null;

  return (
    <>
      <section className="border-b border-line bg-paper">
        <Container className="py-14 sm:py-16">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
                Grow the collection
              </p>
              <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                Share a Book
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
                Add a title you think belongs on the shelves. You can edit or
                remove it later from My Books.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 self-start rounded-full bg-brand-soft px-3.5 py-2 text-xs font-semibold text-brand-soft-foreground sm:self-auto">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Every shelf starts with one book
            </span>
          </div>
        </Container>
      </section>

      <section className="bg-canvas py-10 sm:py-12">
        <Container>
          <div className="rounded-2xl border border-line bg-paper p-6 shadow-sm sm:p-8">
            <div className="mb-7 flex items-center gap-3 border-b border-line pb-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand-soft-foreground">
                <BookPlus className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-display text-xl font-semibold text-ink">
                  Book details
                </h2>
                <p className="text-sm text-muted">
                  A cover, a category, and a few copies are all you need.
                </p>
              </div>
            </div>

            <BookForm
              user={{ id: user.id, name: user.name, email: user.email }}
              onSuccess={(book) => router.push(`/books/${book.id}`)}
            />
          </div>
        </Container>
      </section>
    </>
  );
}

export default function AddBookPage() {
  return (
    <AuthGate>
      <AddBookContent />
    </AuthGate>
  );
}
