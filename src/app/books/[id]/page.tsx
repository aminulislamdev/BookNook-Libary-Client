"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Library,
  UserRound,
} from "lucide-react";
import BookCover from "@/components/books/BookCover";
import BorrowModal from "@/components/books/BorrowModal";
import AuthGate from "@/components/shared/AuthGate";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import { apiRequest } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import type { Book } from "@/lib/types";
import { formatDate, initials } from "@/lib/utils";

function DetailsSkeleton() {
  return (
    <Container className="py-10 lg:py-16">
      <Skeleton className="h-4 w-32" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,400px)_1fr] lg:gap-16">
        <div>
          <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
          <Skeleton className="mt-5 h-32 w-full rounded-2xl" />
        </div>
        <div className="space-y-5">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-12 w-4/5" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-12 w-52 rounded-xl" />
        </div>
      </div>
    </Container>
  );
}

function BookDetailsContent() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [borrowOpen, setBorrowOpen] = useState(false);

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    setError("");

    apiRequest<{ book: Book } | Book>(`/books/${id}`)
      .then((response) => {
        if (!active) return;
        const fetchedBook = "book" in response ? response.book : response;
        if (fetchedBook) {
          setBook({
            ...fetchedBook,
            id: fetchedBook.id || (fetchedBook as unknown as { _id: string })._id,
          });
        }
      })
      .catch((err: Error) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, reloadKey]);

  // Only block on the first load. Refreshing availability after a borrow keeps
  // the current page mounted so the confirmation modal can show its success state.
  if (loading && !book) {
    return (
      <section className="bg-white">
        <DetailsSkeleton />
      </section>
    );
  }

  if (!book) {
    return (
      <section className="bg-canvas py-16">
        <Container>
          <EmptyState
            icon={AlertCircle}
            title="Book not found"
            description={error || "This title may have been removed from the shelves."}
            action={
              <Button href="/books" variant="outline">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to All Books
              </Button>
            }
          />
        </Container>
      </section>
    );
  }

  const isOwner = user?.id === book.addedBy.id;
  const isUnavailable = (book.availableCopies ?? book.totalCopies ?? 0) <= 0 || (book.totalCopies ?? 0) <= 0;
  const borrowedCount = Math.max(0, book.totalCopies - book.availableCopies);
  const availabilityPercent =
    book.totalCopies > 0
      ? Math.round((book.availableCopies / book.totalCopies) * 100)
      : 0;

  return (
    <>
      <section className="bg-white">
        <Container className="py-10 lg:py-16">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-brand"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to All Books
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,400px)_1fr] lg:gap-16">
            <div className="self-start lg:sticky lg:top-28">
              <div className="relative mx-auto aspect-[2/3] w-full max-w-[400px] overflow-hidden rounded-2xl border border-line bg-slate-100 shadow-[0_25px_60px_-30px_rgba(15,23,42,0.45)]">
                <BookCover
                  src={book.image}
                  alt={`${book.title} by ${book.author}`}
                  sizes="(max-width: 1024px) 100vw, 400px"
                  eager
                />
              </div>

              <div className="mx-auto mt-5 max-w-[400px] rounded-2xl border border-line bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-ink">Availability</p>
                  <Badge
                    variant={isUnavailable ? "red" : book.availableCopies <= 2 ? "amber" : "green"}
                  >
                    {isUnavailable
                      ? "Not available"
                      : `${book.availableCopies} available`}
                  </Badge>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={
                      isUnavailable
                        ? "h-full rounded-full bg-red-400"
                        : "h-full rounded-full bg-brand"
                    }
                    style={{ width: `${availabilityPercent}%` }}
                  />
                </div>

                <div className="mt-3 flex justify-between text-xs text-muted">
                  <span>
                    {book.availableCopies} of {book.totalCopies} copies free
                  </span>
                  <span>{borrowedCount} on loan</span>
                </div>
              </div>
            </div>

            <div>
              <Badge variant="teal">{book.category}</Badge>

              <h1 className="mt-4 text-balance font-display text-4xl font-semibold leading-[1.12] tracking-tight text-ink sm:text-5xl">
                {book.title}
              </h1>

              <p className="mt-3 text-lg text-muted">by {book.author}</p>

              <div className="mt-8 border-t border-line pt-8">
                <h2 className="font-display text-2xl font-semibold text-ink">
                  About this book
                </h2>
                <p className="mt-3 whitespace-pre-line text-pretty text-base leading-8 text-slate-600">
                  {book.description || "No description has been added for this title yet."}
                </p>
              </div>

              <dl className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-line bg-canvas p-4">
                  <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
                    <Library className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
                    Category
                  </dt>
                  <dd className="mt-2 text-sm font-semibold text-ink">
                    {book.category}
                  </dd>
                </div>
                <div className="rounded-2xl border border-line bg-canvas p-4">
                  <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
                    <CalendarDays className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
                    Added on
                  </dt>
                  <dd className="mt-2 text-sm font-semibold text-ink">
                    {formatDate(book.createdAt)}
                  </dd>
                </div>
                <div className="rounded-2xl border border-line bg-canvas p-4">
                  <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
                    <BookOpen className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
                    Total copies
                  </dt>
                  <dd className="mt-2 text-sm font-semibold text-ink">
                    {book.totalCopies}
                  </dd>
                </div>
              </dl>

              <div className="mt-8 flex items-center gap-3 rounded-2xl border border-line bg-white p-4 shadow-sm">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft text-sm font-semibold text-brand-dark">
                  {initials(book.addedBy.name)}
                </span>
                <div>
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                    <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
                    Added by
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-ink">
                    {book.addedBy.name}
                  </p>
                </div>
              </div>

              <div className="mt-8">
                {isUnavailable ? (
                  <div>
                    <Button disabled size="lg" className="w-full sm:w-auto">
                      Not Available
                    </Button>
                    <p className="mt-3 text-sm text-muted">
                      Every copy is currently on loan. Check back soon or explore
                      another title.
                    </p>
                  </div>
                ) : isOwner ? (
                  <div>
                    <Button href="/my-books" variant="outline" size="lg">
                      Manage in My Books
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <p className="mt-3 text-sm text-muted">
                      You added this book, so it is reserved for other readers.
                    </p>
                  </div>
                ) : user ? (
                  <div>
                    <Button
                      size="lg"
                      onClick={() => setBorrowOpen(true)}
                      className="w-full sm:w-auto"
                    >
                      Borrow This Book
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <p className="mt-3 text-sm text-muted">
                      Choose your return date in the next step. No payment required.
                    </p>
                  </div>
                ) : (
                  <div>
                    <Button
                      href={`/login?redirect=${encodeURIComponent(`/books/${book.id}`)}`}
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      Sign in to Borrow
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <p className="mt-3 text-sm text-muted">
                      Create a free account to borrow this book.
                    </p>
                  </div>
                )}
              </div>

              {reloadKey > 0 && book.availableCopies < book.totalCopies ? (
                <p className="mt-4 text-xs text-muted">
                  Availability updates automatically after each loan.
                </p>
              ) : null}
            </div>
          </div>
        </Container>
      </section>

      {user ? (
        <BorrowModal
          open={borrowOpen}
          onClose={() => setBorrowOpen(false)}
          book={book}
          user={{ id: user.id, name: user.name, email: user.email }}
          onBorrowed={reload}
        />
      ) : null}
    </>
  );
}

export default function BookDetailsPage() {
  return (
    <AuthGate>
      <Suspense
        fallback={
          <section className="bg-white">
            <DetailsSkeleton />
          </section>
        }
      >
        <BookDetailsContent />
      </Suspense>
    </AuthGate>
  );
}
