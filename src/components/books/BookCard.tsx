import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import Badge from "@/components/ui/Badge";
import BookCover from "@/components/books/BookCover";
import type { Book } from "@/lib/types";
import { cn } from "@/lib/utils";

export function availabilityText(book: Book) {
  if (book.availableCopies === 0) return "Not available";
  if (book.availableCopies <= 2) return `Only ${book.availableCopies} left`;
  return `${book.availableCopies} of ${book.totalCopies} available`;
}

export function availabilityTone(book: Book) {
  if (book.availableCopies === 0) return "text-red-600";
  if (book.availableCopies <= 2) return "text-amber-600";
  return "text-emerald-600";
}

export default function BookCard({
  book,
  actions,
  className,
}: {
  book: Book;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_-24px_rgba(15,23,42,0.28)]",
        className,
      )}
    >
      <Link
        href={`/books/${book.id}`}
        className="relative block aspect-[2/3] overflow-hidden bg-slate-100"
        aria-label={`View details for ${book.title}`}
      >
        <BookCover
          src={book.image}
          alt={`${book.title} by ${book.author}`}
          className="transition duration-500 group-hover:scale-[1.035]"
        />
        <div className="absolute left-3 top-3">
          <Badge variant="teal" className="bg-white/95 shadow-sm backdrop-blur">
            {book.category}
          </Badge>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 font-display text-xl font-semibold leading-snug tracking-tight text-ink">
          <Link
            href={`/books/${book.id}`}
            className="transition hover:text-brand"
          >
            {book.title}
          </Link>
        </h3>
        <p className="mt-1.5 text-sm text-muted">by {book.author}</p>

        <div className="mt-3 flex items-center gap-2 text-xs font-semibold">
          <span
            aria-hidden="true"
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              book.availableCopies === 0
                ? "bg-red-500"
                : book.availableCopies <= 2
                  ? "bg-amber-500"
                  : "bg-emerald-500",
            )}
          />
          <span className={availabilityTone(book)}>{availabilityText(book)}</span>
        </div>

        <div className="mt-auto pt-5">
          {actions ?? (
            // ✅ Button এর বদলে Link ব্যবহার করা হলো
            <Link
              href={`/books/${book.id}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-soft py-2.5 text-sm font-semibold text-brand-dark transition hover:bg-teal-100/80"
            >
              View Details
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}