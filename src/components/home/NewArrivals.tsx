"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link"; // ✅ Link ইম্পোর্ট করো
import { AlertCircle, ArrowRight, RefreshCw } from "lucide-react";
import BookCard from "@/components/books/BookCard";
import BookGridSkeleton from "@/components/books/BookGridSkeleton";
import Alert from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { apiRequest } from "@/lib/api";
import type { Book, BooksResponse } from "@/lib/types";

export default function NewArrivals() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    setReloadKey((key) => key + 1);
  }, []);

  useEffect(() => {
    let active = true;

    apiRequest<BooksResponse | Book[]>("/books?limit=6&sort=newest", {
      auth: false,
    })
      .then((data) => {
        if (!active) return;
        if (Array.isArray(data)) {
          setBooks(data);
        } else if (data?.books) {
          setBooks(data.books);
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
  }, [reloadKey]);

  return (
    <section id="new-arrivals" className="bg-canvas py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Just arrived"
          title="New Arrivals"
          description="The latest additions to the BookNook shelves — ready to be discovered."
          action={
            // ✅ Button-এর বদলে Link
            <Link
              href="/books"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-line bg-white px-5 text-sm font-semibold text-ink transition hover:border-brand/40 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              See All Books
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />

        <div className="mt-10">
          {loading ? (
            <BookGridSkeleton count={6} />
          ) : error ? (
            <Alert variant="error" className="flex-col items-start gap-4 p-5">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                {error}
              </div>
              <Button onClick={load} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Try again
              </Button>
            </Alert>
          ) : books.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-line bg-white p-12 text-center">
              <p className="font-display text-2xl font-semibold text-ink">
                The shelves are waiting
              </p>
              <p className="mt-2 text-sm text-muted">
                Add the first book to start the collection.
              </p>
              {/* ✅ Button-এর বদলে Link */}
              <Link
                href="/add-book"
                className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              >
                Add a Book
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}