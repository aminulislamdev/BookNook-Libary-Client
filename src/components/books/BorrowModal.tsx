"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, CheckCircle2 } from "lucide-react";
import BookCover from "@/components/books/BookCover";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Form";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { apiRequest } from "@/lib/api";
import type { Book, Borrow } from "@/lib/types";
import { daysFromNow, formatDate, toDateInputValue } from "@/lib/utils";

type SessionUser = {
  id: string;
  name: string;
  email: string;
};

export default function BorrowModal({
  open,
  onClose,
  book,
  user,
  onBorrowed,
}: {
  open: boolean;
  onClose: () => void;
  book: Book;
  user: SessionUser;
  onBorrowed: () => void;
}) {
  const toast = useToast();
  const today = toDateInputValue(new Date());
  const [borrowDate, setBorrowDate] = useState(today);
  const [returnDate, setReturnDate] = useState(toDateInputValue(daysFromNow(14)));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isUnavailable = (book.availableCopies ?? book.totalCopies ?? 0) <= 0 || (book.totalCopies ?? 0) <= 0;

  useEffect(() => {
    if (!open) return;
    setBorrowDate(toDateInputValue(new Date()));
    setReturnDate(toDateInputValue(daysFromNow(14)));
    setError("");
    setSuccess(false);
    setIsSubmitting(false);
  }, [open]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const payload = {
        bookId: book.id,
        bookTitle: book.title,
        bookImage: book.image,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        borrowDate: new Date(`${borrowDate}T00:00:00`).toISOString(),
        returnDate: new Date(`${returnDate}T23:59:59`).toISOString(),
        dueDate: new Date(`${returnDate}T23:59:59`).toISOString(),
      };

      await apiRequest<{ borrow: Borrow }>("/borrows", {
        method: "POST",
        body: payload,
      });

      setSuccess(true);
      toast.success(`You have borrowed "${book.title}"!`); // ✅ সাকসেস টোস্ট
      onBorrowed();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not borrow this book.";
      setError(msg);
      toast.error(msg); // ✅ এরর টোস্ট (ডাবল বোরো হলে এখানে মেসেজ আসবে)
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={success ? "Borrowed successfully" : "Borrow this book"}
      description={
        success
          ? "Your loan is confirmed. Enjoy the read."
          : "Confirm the borrower details below and verify your loan dates."
      }
    >
      {success ? (
        <div className="text-center py-2">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
          </span>
          <p className="mt-5 font-display text-xl font-semibold text-ink">
            {book.title}
          </p>
          <p className="mt-1 text-sm text-muted">
            Due back by {formatDate(new Date(`${returnDate}T23:59:59`))}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href="/my-borrows" className="flex-1">
              View My Borrows
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1">
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex gap-4 rounded-2xl border border-line bg-slate-50 p-3.5">
            <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-lg border border-line bg-white">
              <BookCover
                src={book.image}
                alt={`${book.title} by ${book.author}`}
                sizes="64px"
              />
            </div>
            <div className="min-w-0 self-center">
              <p className="line-clamp-2 font-display text-lg font-semibold leading-snug text-ink">
                {book.title}
              </p>
              <p className="mt-1 text-sm text-muted">by {book.author}</p>
              <p className="mt-2 text-xs font-semibold text-brand">
                {book.availableCopies} {book.availableCopies === 1 ? "copy" : "copies"} available
              </p>
            </div>
          </div>

          {/* User Name & User Email (read-only) */}
          <div className="grid gap-4 sm:grid-cols-2 rounded-xl bg-slate-50 p-3.5 border border-line">
            <div>
              <Label htmlFor="borrower-name" className="text-xs text-muted">
                User Name
              </Label>
              <Input
                id="borrower-name"
                value={user.name}
                readOnly
                disabled
                className="bg-white/80 cursor-not-allowed text-sm font-medium"
              />
            </div>
            <div>
              <Label htmlFor="borrower-email" className="text-xs text-muted">
                User Email
              </Label>
              <Input
                id="borrower-email"
                value={user.email}
                readOnly
                disabled
                className="bg-white/80 cursor-not-allowed text-sm font-medium"
              />
            </div>
          </div>

          {/* Borrow Date & Return Date */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="borrow-date">
                <span className="inline-flex items-center gap-1.5 text-xs text-muted font-medium">
                  <CalendarDays className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
                  Borrow Date
                </span>
              </Label>
              <Input
                id="borrow-date"
                type="date"
                value={borrowDate}
                onChange={(event) => setBorrowDate(event.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="borrow-return-date">
                <span className="inline-flex items-center gap-1.5 text-xs text-muted font-medium">
                  <CalendarDays className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
                  Return Date
                </span>
              </Label>
              <Input
                id="borrow-return-date"
                type="date"
                value={returnDate}
                min={borrowDate}
                onChange={(event) => setReturnDate(event.target.value)}
                required
              />
            </div>
          </div>

          <p className="text-xs text-muted">
            You can return the book at any time from your My Borrows dashboard.
          </p>

          {error ? <Alert variant="error">{error}</Alert> : null}

          <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isUnavailable}>
              {isUnavailable ? "Not Available" : isSubmitting ? "Processing…" : "Confirm Borrow"}
              {!isSubmitting && !isUnavailable ? (
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              ) : null}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}