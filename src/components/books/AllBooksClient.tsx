"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, RefreshCw, Search, SearchX, X } from "lucide-react";
import BookCard from "@/components/books/BookCard";
import BookGridSkeleton from "@/components/books/BookGridSkeleton";
import Pagination from "@/components/books/Pagination";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import EmptyState from "@/components/ui/EmptyState";
import { Input, Label, Select } from "@/components/ui/Form";
import { apiRequest } from "@/lib/api";
import { useDebouncedValue } from "@/lib/hooks";
import { CATEGORIES, type Book, type BooksResponse, type Category } from "@/lib/types";

const PAGE_SIZE = 9;

export default function AllBooksClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialCategory = searchParams.get("category");
  const initialPage = Number.parseInt(searchParams.get("page") ?? "1", 10);

  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState<string>(
    initialCategory && CATEGORIES.includes(initialCategory as Category)
      ? initialCategory
      : "All",
  );
  const [page, setPage] = useState(
    Number.isNaN(initialPage) || initialPage < 1 ? 1 : initialPage,
  );
  const [data, setData] = useState<BooksResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const debouncedSearch = useDebouncedValue(search, 350);
  const isFirstFilterRun = useRef(true);

  const retry = useCallback(() => setReloadKey((key) => key + 1), []);

  // Whenever the search or category changes, start again from page one.
  useEffect(() => {
    if (isFirstFilterRun.current) {
      isFirstFilterRun.current = false;
      return;
    }
    setPage(1);
  }, [debouncedSearch, category]);

  // Fetch the current page from the Express API.
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    const params = new URLSearchParams({
      page: String(page),
      limit: String(PAGE_SIZE),
      sort: "newest",
    });

    if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
    if (category !== "All") params.set("category", category);

    apiRequest<BooksResponse | Book[]>(`/books?${params.toString()}`)
      .then((response) => {
        if (!active) return;
        if (Array.isArray(response)) {
          setData({
            books: response,
            total: response.length,
            page: 1,
            limit: response.length,
            totalPages: 1,
          });
        } else {
          setData(response);
          if (response.page !== page) setPage(response.page);
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
  }, [page, debouncedSearch, category, reloadKey]);

  // Keep filters shareable in the URL without triggering a scroll jump.
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch.trim()) params.set("q", debouncedSearch.trim());
    if (category !== "All") params.set("category", category);
    if (page > 1) params.set("page", String(page));

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [debouncedSearch, category, page, pathname, router]);

  const hasFilters = Boolean(debouncedSearch.trim()) || category !== "All";
  const books = data?.books ?? [];
  const total = data?.total ?? 0;

  function clearFilters() {
    setSearch("");
    setCategory("All");
    setPage(1);
  }

  return (
    <>
      <section className="border-b border-line bg-white">
        <Container className="py-14 sm:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
            The collection
          </p>
          <h1 className="mt-3 text-balance font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Explore Our Library
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-muted">
            Search the shelves, follow a category, and find the book that fits
            the moment. Every title shows its current availability.
          </p>
        </Container>
      </section>

      <section className="bg-canvas py-10 sm:py-12">
        <Container>
          <div className="rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-5">
            <div className="grid gap-4 md:grid-cols-[1fr_240px]">
              <div>
                <Label htmlFor="book-search" className="sr-only">
                  Search books
                </Label>
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                  />
                  <Input
                    id="book-search"
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by title, author, or description…"
                    className="pl-11 pr-11"
                  />
                  {search ? (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      aria-label="Clear search"
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-ink"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
              </div>

              <div>
                <Label htmlFor="book-category" className="sr-only">
                  Filter by category
                </Label>
                <Select
                  id="book-category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  <option value="All">All categories</option>
                  {CATEGORIES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted" aria-live="polite">
              {loading
                ? "Finding books…"
                : total === 0
                  ? "No books match these filters"
                  : `Showing ${(data?.page ?? 1) === 1 ? 1 : (data!.page - 1) * PAGE_SIZE + 1}–${Math.min(
                      (data?.page ?? 1) * PAGE_SIZE,
                      total,
                    )} of ${total} ${total === 1 ? "book" : "books"}`}
            </p>
            {hasFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-semibold text-brand transition hover:text-brand-dark"
              >
                Clear filters
              </button>
            ) : null}
          </div>

          <div className="mt-6">
            {loading ? (
              <BookGridSkeleton count={PAGE_SIZE} />
            ) : error ? (
              <Alert variant="error" className="flex-col items-start gap-4 p-5">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  {error}
                </div>
                <Button onClick={retry} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  Try again
                </Button>
              </Alert>
            ) : books.length === 0 ? (
              <EmptyState
                icon={SearchX}
                title="No books found"
                description="Try a different search term or clear the category filter to see the full collection."
                action={
                  <Button onClick={clearFilters} variant="outline">
                    Clear filters
                  </Button>
                }
              />
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {books.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
                <Pagination
                  page={data?.page ?? 1}
                  totalPages={data?.totalPages ?? 1}
                  onChange={(nextPage) => {
                    setPage(nextPage);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
