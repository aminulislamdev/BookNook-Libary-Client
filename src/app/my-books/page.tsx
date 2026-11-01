"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link"; // ✅ Link ইম্পোর্ট করো
import { AlertCircle, BookPlus, Library, Pencil, RefreshCw, Trash2 } from "lucide-react";
import AuthGate from "@/components/shared/AuthGate";
import BookCard from "@/components/books/BookCard";
import BookCover from "@/components/books/BookCover";
import BookForm from "@/components/books/BookForm";
import BookGridSkeleton from "@/components/books/BookGridSkeleton";
import Alert from "@/components/ui/Alert";
import Badge from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Container from "@/components/ui/Container";
import EmptyState from "@/components/ui/EmptyState";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { apiRequest } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import type { Book, BooksResponse } from "@/lib/types";

function MyBooksContent() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const toast = useToast();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [editing, setEditing] = useState<Book | null>(null);
  const [deleting, setDeleting] = useState<Book | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const reload = useCallback(() => {
    setLoading(true);
    setError("");
    setReloadKey((key) => key + 1);
  }, []);

  useEffect(() => {
    if (!user) return;
    let active = true;

    apiRequest<BooksResponse>(
      `/books?addedBy=${encodeURIComponent(user.id)}&userEmail=${encodeURIComponent(user.email)}&limit=100&sort=newest`
    )
      .then((response) => {
        if (active) setBooks(response.books);
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

  const totalCopies = books.reduce((sum, book) => sum + book.totalCopies, 0);
  const availableCopies = books.reduce((sum, book) => sum + book.availableCopies, 0);

  async function handleDelete() {
    if (!deleting) return;
    const targetId = deleting.id;
    setIsDeleting(true);
    setDeleteError("");

    try {
      await apiRequest(`/books/${targetId}?userId=${encodeURIComponent(user!.id)}`, {
        method: "DELETE",
      });
      setBooks((prev) => prev.filter((b) => b.id !== targetId));
      toast.success(`"${deleting.title}" has been deleted.`);
      setDeleting(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not delete the book.";
      setDeleteError(msg);
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <section className="border-b border-line bg-white">
        <Container className="py-14 sm:py-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
                Your shelf
              </p>
              <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                My Added Books
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
                Every title you have added to BookNook, with its current
                availability and loan status.
              </p>
            </div>
            {/* ✅ Button এর বদলে Link */}
            <Link
              href="/add-book"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              <BookPlus className="h-4 w-4" aria-hidden="true" />
              Add a Book
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-line bg-canvas p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Titles added
              </p>
              <p className="mt-1 font-display text-2xl font-semibold text-ink">
                {books.length}
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-canvas p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Total copies
              </p>
              <p className="mt-1 font-display text-2xl font-semibold text-ink">
                {totalCopies}
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-canvas p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                On the shelf
              </p>
              <p className="mt-1 font-display text-2xl font-semibold text-brand">
                {availableCopies}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-canvas py-10 sm:py-12">
        <Container>
          {loading ? (
            <BookGridSkeleton count={6} />
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
          ) : books.length === 0 ? (
            <EmptyState
              icon={Library}
              title="Your shelf is empty"
              description="Add the first book you want to share with the BookNook community."
              action={
                // ✅ Button এর বদলে Link
                <Link
                  href="/add-book"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                >
                  <BookPlus className="h-4 w-4" aria-hidden="true" />
                  Add Your First Book
                </Link>
              }
            />
          ) : (
            <>
              <div className="hidden md:block overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-line bg-slate-50 text-xs font-semibold uppercase tracking-wider text-muted">
                    <tr>
                      <th scope="col" className="px-6 py-4">Book</th>
                      <th scope="col" className="px-6 py-4">Category</th>
                      <th scope="col" className="px-6 py-4">Total Copies</th>
                      <th scope="col" className="px-6 py-4">Available</th>
                      <th scope="col" className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {books.map((book) => (
                      <tr key={book.id} className="transition hover:bg-slate-50/80">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3.5">
                            <div className="relative h-16 w-11 shrink-0 overflow-hidden rounded-lg border border-line bg-slate-100">
                              <BookCover src={book.image} alt={book.title} sizes="48px" />
                            </div>
                            <div>
                              <p className="font-display font-semibold text-ink line-clamp-1">
                                {book.title}
                              </p>
                              <p className="text-xs text-muted">by {book.author}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="teal">{book.category}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-ink">
                          {book.totalCopies}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={
                              book.availableCopies === 0
                                ? "font-semibold text-rose-600"
                                : book.availableCopies <= 2
                                  ? "font-semibold text-amber-600"
                                  : "font-semibold text-emerald-600"
                            }
                          >
                            {book.availableCopies} left
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* ✅ Button এর বদলে Link */}
                            <Link
                              href={`/books/${book.id}`}
                              className="inline-flex h-9 items-center justify-center rounded-xl bg-brand-soft px-3.5 text-sm font-semibold text-brand-dark transition hover:bg-teal-100/80"
                            >
                              View
                            </Link>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setEditing(book)}
                              aria-label={`Edit ${book.title}`}
                            >
                              <Pencil className="h-4 w-4" aria-hidden="true" />
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setDeleteError("");
                                setDeleting(book);
                              }}
                              aria-label={`Delete ${book.title}`}
                              className="text-red-600 hover:border-red-200 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" aria-hidden="true" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 md:hidden">
                {books.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    actions={
                      <div className="flex gap-2">
                        {/* ✅ Button এর বদলে Link */}
                        <Link
                          href={`/books/${book.id}`}
                          className="flex h-9 flex-1 items-center justify-center rounded-xl bg-brand-soft px-3.5 text-sm font-semibold text-brand-dark transition hover:bg-teal-100/80"
                        >
                          View
                        </Link>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setEditing(book)}
                          aria-label={`Edit ${book.title}`}
                        >
                          <Pencil className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setDeleteError("");
                            setDeleting(book);
                          }}
                          aria-label={`Delete ${book.title}`}
                          className="text-red-600 hover:border-red-200 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </div>
                    }
                  />
                ))}
              </div>
            </>
          )}
        </Container>
      </section>

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Edit book"
        description="Update the details below. Availability is recalculated automatically."
        className="max-w-2xl"
      >
        {editing ? (
          <BookForm
            key={editing.id}
            book={editing}
            user={{ id: user.id, name: user.name, email: user.email }}
            showPreview={false}
            submitLabel="Save Changes"
            onCancel={() => setEditing(null)}
            onSuccess={(updated) => {
              setEditing(null);
              if (updated?.id) {
                setBooks((prev) =>
                  prev.map((b) => (b.id === updated.id ? updated : b))
                );
              }
              reload();
            }}
          />
        ) : null}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => {
          setDeleting(null);
          setDeleteError("");
        }}
        onConfirm={handleDelete}
        title="Delete this book?"
        description="This removes the title from the library. Books currently on loan cannot be deleted."
        confirmLabel="Delete Book"
        variant="danger"
        isLoading={isDeleting}
        error={deleteError}
      >
        {deleting ? (
          <div className="flex gap-4 rounded-2xl border border-line bg-slate-50 p-3.5">
            <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-lg border border-line bg-white">
              <BookCover
                src={deleting.image}
                alt={deleting.title}
                sizes="64px"
              />
            </div>
            <div className="min-w-0 self-center">
              <p className="line-clamp-2 font-display text-lg font-semibold leading-snug text-ink">
                {deleting.title}
              </p>
              <p className="mt-1 text-sm text-muted">by {deleting.author}</p>
            </div>
          </div>
        ) : null}
      </ConfirmDialog>
    </>
  );
}

export default function MyBooksPage() {
  return (
    <AuthGate>
      <MyBooksContent />
    </AuthGate>
  );
}