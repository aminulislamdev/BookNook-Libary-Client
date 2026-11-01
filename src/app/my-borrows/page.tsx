"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  BookMarked,
  CalendarDays,
  CheckCircle2,
  Clock,
  History,
  RefreshCw,
  RotateCcw,
} from "lucide-react";
import AuthGate from "@/components/shared/AuthGate";
import BookCover from "@/components/books/BookCover";
import Alert from "@/components/ui/Alert";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Container from "@/components/ui/Container";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { apiRequest } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import type { Borrow, BorrowsResponse } from "@/lib/types";
import { cn, daysBetween, formatDate } from "@/lib/utils";

type Tab = "active" | "history";

function BorrowsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex gap-4 rounded-2xl border border-line bg-white p-4 shadow-sm"
        >
          <Skeleton className="h-28 w-20 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-3 py-1">
            <Skeleton className="h-4 w-24 rounded-full" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-9 w-32 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

function MyBorrowsContent() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const toast = useToast();

  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [tab, setTab] = useState<Tab>("active");

  const [returning, setReturning] = useState<Borrow | null>(null);
  const [isReturning, setIsReturning] = useState(false);
  const [returnError, setReturnError] = useState("");

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  useEffect(() => {
    if (!user) return;
    let active = true;
    setLoading(true);
    setError("");

    apiRequest<BorrowsResponse>(
      `/borrows?userId=${encodeURIComponent(user.id)}&userEmail=${encodeURIComponent(user.email)}`
    )
      .then((response) => {
        if (active) setBorrows(response.borrows);
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
  }, [user, reloadKey]);

  if (!user) return null;

  const activeBorrows = borrows.filter((borrow) => borrow.returnedAt === null);
  const historyBorrows = borrows.filter((borrow) => borrow.returnedAt !== null);
  const overdueCount = activeBorrows.filter(
    (borrow) => daysBetween(borrow.dueDate || (borrow as unknown as { returnDate: string }).returnDate) < 0,
  ).length;
  const visible = tab === "active" ? activeBorrows : historyBorrows;

  async function handleReturn() {
    if (!returning) return;
    const targetBorrowId = returning.id;
    const title = returning.book?.title || (returning as unknown as { bookTitle?: string }).bookTitle || "Book";
    setIsReturning(true);
    setReturnError("");

    try {
      await apiRequest(`/borrows/${targetBorrowId}`, {
        method: "DELETE",
      });

      // Update UI by removing or marking returned
      setBorrows((prev) => prev.filter((b) => b.id !== targetBorrowId));
      toast.success(`"${title}" returned successfully! Copy restored.`);
      setReturning(null);
      reload();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not return the book.";
      setReturnError(msg);
      toast.error(msg);
    } finally {
      setIsReturning(false);
    }
  }

  return (
    <>
      <section className="border-b border-line bg-white">
        <Container className="py-14 sm:py-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
                Your reading list
              </p>
              <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                My Borrowed Books
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
                Keep track of what is in your hands, what is due soon, and the
                books you have already returned.
              </p>
            </div>
            <Button href="/books" variant="outline">
              <BookMarked className="h-4 w-4" aria-hidden="true" />
              Borrow Another Book
            </Button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-line bg-canvas p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Active loans
              </p>
              <p className="mt-1 font-display text-2xl font-semibold text-ink">
                {activeBorrows.length}
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-canvas p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Due soon / overdue
              </p>
              <p
                className={cn(
                  "mt-1 font-display text-2xl font-semibold",
                  overdueCount > 0 ? "text-red-600" : "text-ink",
                )}
              >
                {overdueCount}
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-canvas p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Books returned
              </p>
              <p className="mt-1 font-display text-2xl font-semibold text-brand">
                {historyBorrows.length}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-canvas py-10 sm:py-12">
        <Container>
          <div className="flex gap-2 border-b border-line">
            {(
              [
                { key: "active" as const, label: "Active", count: activeBorrows.length, icon: Clock },
                { key: "history" as const, label: "History", count: historyBorrows.length, icon: History },
              ]
            ).map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setTab(item.key)}
                  aria-current={tab === item.key ? "page" : undefined}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-3 text-sm font-semibold transition",
                    tab === item.key
                      ? "text-brand"
                      : "text-slate-500 hover:text-ink",
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs",
                      tab === item.key
                        ? "bg-brand-soft text-brand-dark"
                        : "bg-slate-100 text-slate-500",
                    )}
                  >
                    {item.count}
                  </span>
                  {tab === item.key ? (
                    <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand" />
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="mt-8">
            {loading ? (
              <BorrowsSkeleton />
            ) : error ? (
              <Alert variant="error" className="flex-col items-start gap-4 p-5">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  {error}
                </div>
                <Button onClick={reload} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  Try again
                </Button>
              </Alert>
            ) : visible.length === 0 ? (
              <EmptyState
                icon={tab === "active" ? BookMarked : History}
                title={tab === "active" ? "No active borrows" : "No reading history yet"}
                description={
                  tab === "active"
                    ? "Find a title that catches your eye and borrow it in a click."
                    : "Books you return will appear here, ready to revisit."
                }
                action={
                  tab === "active" ? (
                    <Button href="/books">Browse Books</Button>
                  ) : undefined
                }
              />
            ) : (
              <>
                {/* Desktop Responsive Table */}
                <div className="hidden md:block overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-line bg-slate-50 text-xs font-semibold uppercase tracking-wider text-muted">
                      <tr>
                        <th scope="col" className="px-6 py-4">Book</th>
                        <th scope="col" className="px-6 py-4">Borrow Date</th>
                        <th scope="col" className="px-6 py-4">Return Date</th>
                        <th scope="col" className="px-6 py-4">Status</th>
                        <th scope="col" className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {visible.map((borrow) => {
                        const book = borrow.book;
                        const raw = borrow as unknown as { bookImage?: string; bookTitle?: string; borrowDate?: string; returnDate?: string };
                        const bookImage = book?.image || raw.bookImage || "";
                        const bookTitle = book?.title || raw.bookTitle || "Borrowed Book";
                        const borrowDate = raw.borrowDate || borrow.borrowedAt;
                        const returnDate = raw.returnDate || borrow.dueDate;
                        const isActive = borrow.returnedAt === null;
                        const daysLeft = isActive ? daysBetween(returnDate) : 0;
                        const overdue = isActive && daysLeft < 0;

                        return (
                          <tr key={borrow.id} className="transition hover:bg-slate-50/80">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3.5">
                                <div className="relative h-16 w-11 shrink-0 overflow-hidden rounded-lg border border-line bg-slate-100">
                                  <BookCover src={bookImage} alt={bookTitle} sizes="48px" />
                                </div>
                                <div>
                                  <p className="font-display font-semibold text-ink line-clamp-1">
                                    {bookTitle}
                                  </p>
                                  <p className="text-xs text-muted">
                                    {book ? `by ${book.author}` : "Library Title"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-muted font-medium">
                              {formatDate(borrowDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={cn(
                                  "font-medium",
                                  overdue ? "text-rose-600 font-semibold" : "text-ink"
                                )}
                              >
                                {formatDate(isActive ? returnDate : borrow.returnedAt)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant={!isActive ? "slate" : overdue ? "red" : "green"}>
                                {!isActive ? "Returned" : overdue ? "Overdue" : "Active"}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              {isActive ? (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setReturnError("");
                                    setReturning(borrow);
                                  }}
                                >
                                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                                  Return Book
                                </Button>
                              ) : (
                                <Button
                                  href={book ? `/books/${book.id}` : "/books"}
                                  size="sm"
                                  variant="secondary"
                                >
                                  {book ? "View Book" : "Browse Books"}
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Responsive Cards */}
                <div className="md:hidden space-y-4">
                  {visible.map((borrow) => {
                    const book = borrow.book;
                    const raw = borrow as unknown as { bookImage?: string; bookTitle?: string; borrowDate?: string; returnDate?: string };
                    const bookImage = book?.image || raw.bookImage || "";
                    const bookTitle = book?.title || raw.bookTitle || "Borrowed Book";
                    const borrowDate = raw.borrowDate || borrow.borrowedAt;
                    const returnDate = raw.returnDate || borrow.dueDate;
                    const isActive = borrow.returnedAt === null;
                    const daysLeft = isActive ? daysBetween(returnDate) : 0;
                    const overdue = isActive && daysLeft < 0;

                    return (
                      <article
                        key={borrow.id}
                        className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 shadow-sm sm:flex-row sm:p-5"
                      >
                        <div className="relative h-32 w-24 shrink-0 self-start overflow-hidden rounded-xl border border-line bg-slate-100">
                          <BookCover
                            src={bookImage}
                            alt={bookTitle}
                            sizes="96px"
                          />
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <Badge
                                variant={
                                  !isActive ? "slate" : overdue ? "red" : "green"
                                }
                              >
                                {!isActive ? "Returned" : overdue ? "Overdue" : "Active"}
                              </Badge>
                              <h2 className="mt-2 line-clamp-2 font-display text-xl font-semibold leading-snug text-ink">
                                {bookTitle}
                              </h2>
                              <p className="mt-1 text-sm text-muted">
                                {book ? `by ${book.author}` : "BookNook Library Title"}
                              </p>
                            </div>

                            <div className="text-left text-xs text-muted sm:text-right">
                              <p>
                                Borrowed{" "}
                                <span className="font-semibold text-ink">
                                  {formatDate(borrowDate)}
                                </span>
                              </p>
                              <p className="mt-1">
                                {isActive ? "Return by" : "Returned on"}{" "}
                                <span
                                  className={cn(
                                    "font-semibold",
                                    overdue ? "text-red-600" : "text-ink",
                                  )}
                                >
                                  {formatDate(
                                    isActive ? returnDate : borrow.returnedAt,
                                  )}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                            <p
                              className={cn(
                                "inline-flex items-center gap-2 text-sm font-medium",
                                overdue
                                  ? "text-red-600"
                                  : isActive
                                    ? "text-slate-600"
                                    : "text-muted",
                              )}
                            >
                              {isActive ? (
                                <>
                                  {overdue ? (
                                    <AlertCircle className="h-4 w-4" aria-hidden="true" />
                                  ) : (
                                    <CalendarDays className="h-4 w-4" aria-hidden="true" />
                                  )}
                                  {overdue
                                    ? `Overdue by ${Math.abs(daysLeft)} ${Math.abs(daysLeft) === 1 ? "day" : "days"}`
                                    : daysLeft === 0
                                      ? "Due today"
                                      : `Due in ${daysLeft} ${daysLeft === 1 ? "day" : "days"}`}
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                                  Thanks for returning this one.
                                </>
                              )}
                            </p>

                            {isActive ? (
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setReturnError("");
                                  setReturning(borrow);
                                }}
                              >
                                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                                Return Book
                              </Button>
                            ) : (
                              <Button
                                href={book ? `/books/${book.id}` : "/books"}
                                size="sm"
                                variant="secondary"
                              >
                                {book ? "View Book" : "Browse Books"}
                              </Button>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </Container>
      </section>

      <ConfirmDialog
        open={Boolean(returning)}
        onClose={() => {
          setReturning(null);
          setReturnError("");
        }}
        onConfirm={handleReturn}
        title="Return this book?"
        description="The copy will go back to the shelf and become available to other readers."
        confirmLabel="Return Book"
        isLoading={isReturning}
        error={returnError}
      >
        {returning?.book ? (
          <div className="flex gap-4 rounded-2xl border border-line bg-slate-50 p-3.5">
            <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-lg border border-line bg-white">
              <BookCover
                src={returning.book.image}
                alt={returning.book.title}
                sizes="64px"
              />
            </div>
            <div className="min-w-0 self-center">
              <p className="line-clamp-2 font-display text-lg font-semibold leading-snug text-ink">
                {returning.book.title}
              </p>
              <p className="mt-1 text-sm text-muted">
                by {returning.book.author}
              </p>
            </div>
          </div>
        ) : null}
      </ConfirmDialog>
    </>
  );
}

export default function MyBorrowsPage() {
  return (
    <AuthGate>
      <MyBorrowsContent />
    </AuthGate>
  );
}
