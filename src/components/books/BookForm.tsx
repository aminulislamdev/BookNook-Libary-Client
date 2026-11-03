"use client";

import { useState, useRef } from "react";
import { ArrowRight, ImageIcon, Upload, ExternalLink } from "lucide-react";
import BookCover from "@/components/books/BookCover";
import Badge from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FieldError, Input, Label, Select, Textarea } from "@/components/ui/Form";
import { apiRequest } from "@/lib/api";
import { CATEGORIES, type Book } from "@/lib/types";
import { useToast } from "@/components/ui/Toast";
import Link from "next/link";

type SessionUser = {
  id: string;
  name: string;
  email: string;
};

type BookFormValues = {
  title: string;
  author: string;
  category: string;
  totalCopies: string;
  description: string;
  image: string;
};

export default function BookForm({
  user,
  book,
  onSuccess,
  onCancel,
  showPreview = true,
  submitLabel,
}: {
  user: SessionUser;
  book?: Book;
  onSuccess?: (book: Book) => void;
  onCancel?: () => void;
  showPreview?: boolean;
  submitLabel?: string;
}) {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [values, setValues] = useState<BookFormValues>({
    title: book?.title ?? "",
    author: book?.author ?? "",
    category: book?.category ?? "Fiction",
    totalCopies: String(book?.totalCopies ?? 1),
    description: book?.description ?? "",
    image: book?.image ?? "",
  });
  const [fieldError, setFieldError] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  function update<K extends keyof BookFormValues>(key: K, value: BookFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFieldError("Please select a valid image file (PNG, JPG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFieldError("Image file size should be less than 5MB.");
      return;
    }

    setIsUploading(true);
    setFieldError("");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to upload image to ImgBB.");
      }

      update("image", data.data.url);
      toast.success("Image uploaded successfully to ImgBB!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to upload image.";
      setFieldError(message);
      toast.error(message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFieldError("");

    if (!values.title.trim() || !values.author.trim()) {
      setFieldError("A title and author are required.");
      toast.error("Please provide both a book title and author name.");
      return;
    }

    const copies = Number.parseInt(values.totalCopies, 10);
    if (Number.isNaN(copies) || copies < 1 || copies > 50) {
      setFieldError("Copies must be a number between 1 and 50.");
      toast.error("Copies must be a number between 1 and 50.");
      return;
    }

    setIsSubmitting(true);

    try {
     
      if (!book) {
        const existing = await apiRequest<{ books: Book[] }>(
          `/books?search=${encodeURIComponent(values.title.trim())}`
        );

        const isDuplicate = existing.books.some(
          (b) => b.title.toLowerCase().trim() === values.title.toLowerCase().trim()
        );

        if (isDuplicate) {
          toast.error(`"${values.title.trim()}" already exists in the library!`);
          setIsSubmitting(false);
          return;
        }
      }

      const now = new Date().toISOString();
      const payload = {
        title: values.title.trim(),
        author: values.author.trim(),
        category: values.category,
        totalCopies: copies,
        description: values.description.trim(),
        image: values.image.trim(),
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        createdAt: book?.createdAt ?? now,
        updatedAt: now,
      };

      const response = await apiRequest<{ book: Book }>(
        book ? `/books/${book.id}` : "/books",
        {
          method: book ? "PATCH" : "POST",
          body: payload,
        },
      );

      const savedBook = response.book || (response as unknown as Book);
      toast.success(
        book ? "Book details updated successfully!" : "Book added to the library!"
      );

      onSuccess?.(savedBook);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not save the book.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const previewBook: Book = {
    id: book?.id ?? "preview",
    title: values.title.trim() || "Your book title",
    author: values.author.trim() || "Author name",
    category: (values.category || "Fiction") as Book["category"],
    description: values.description,
    image: values.image,
    totalCopies: Number.parseInt(values.totalCopies, 10) || 1,
    availableCopies: Number.parseInt(values.totalCopies, 10) || 1,
    addedBy: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: "",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div
        className={
          showPreview
            ? "grid gap-8 lg:grid-cols-[1fr_300px] lg:items-start"
            : "space-y-5"
        }
      >
        <div className="space-y-5">
          {/* User info (Read-only as required) */}
          <div className="grid gap-5 sm:grid-cols-2 rounded-xl bg-slate-50 p-4 border border-line">
            <div>
              <Label htmlFor="user-name" className="text-xs text-muted">
                Added By (User Name)
              </Label>
              <Input
                id="user-name"
                value={user.name}
                readOnly
                disabled
                className="bg-white/80 cursor-not-allowed text-sm font-medium"
              />
            </div>
            <div>
              <Label htmlFor="user-email" className="text-xs text-muted">
                User Email
              </Label>
              <Input
                id="user-email"
                value={user.email}
                readOnly
                disabled
                className="bg-white/80 cursor-not-allowed text-sm font-medium"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="book-title">Book title</Label>
              <Input
                id="book-title"
                value={values.title}
                onChange={(event) => update("title", event.target.value)}
                placeholder="The Midnight Library"
                required
              />
            </div>
            <div>
              <Label htmlFor="book-author">Author</Label>
              <Input
                id="book-author"
                value={values.author}
                onChange={(event) => update("author", event.target.value)}
                placeholder="Matt Haig"
                required
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="book-category">Category</Label>
              <Select
                id="book-category"
                value={values.category}
                onChange={(event) => update("category", event.target.value)}
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="book-copies">Number of copies</Label>
              <Input
                id="book-copies"
                type="number"
                min={1}
                max={50}
                value={values.totalCopies}
                onChange={(event) => update("totalCopies", event.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="book-description">Short description</Label>
            <Textarea
              id="book-description"
              value={values.description}
              onChange={(event) => update("description", event.target.value)}
              placeholder="A short, inviting summary of what makes this book worth reading…"
              maxLength={1200}
            />
            <p className="mt-1.5 text-xs text-muted">
              {values.description.length}/1200 characters
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="book-image">Cover image (URL or upload)</Label>
              <div className="flex items-center gap-2 text-xs text-brand font-medium">
                <a
                  href="https://imgbb.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:underline"
                >
                  ImgBB <ExternalLink className="h-3 w-3" />
                </a>
                <span>•</span>
                <a
                  href="https://postimages.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:underline"
                >
                  Postimages <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            <div className="mt-1.5 flex gap-2">
              <div className="relative flex-1">
                <ImageIcon
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <Input
                  id="book-image"
                  value={values.image}
                  onChange={(event) => update("image", event.target.value)}
                  placeholder="https://i.ibb.co/... or /books/the-hobbit.jpg"
                  className="pl-11"
                />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="shrink-0 text-xs px-3"
              >
                <Upload className="h-3.5 w-3.5" />
                {isUploading ? "Uploading..." : "Upload file"}
              </Button>
            </div>
            <p className="mt-1.5 text-xs text-muted">
              Paste an image URL from ImgBB / Postimages or upload directly using the button.
            </p>
          </div>

          <FieldError>{fieldError}</FieldError>
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700" role="alert">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end">
            {onCancel ? (
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            ) : (
              <Link
                href="/books"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-5 h-11 text-sm font-semibold text-ink transition hover:border-brand/40 hover:text-brand"
              >
                Cancel
              </Link>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving…"
                : (submitLabel ?? (book ? "Save Changes" : "Add Book"))}
              {!isSubmitting ? (
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              ) : null}
            </Button>
          </div>
        </div>

        {showPreview ? (
          <aside className="lg:sticky lg:top-28">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-muted">
              Live preview
            </p>
            <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
              <div className="aspect-2/3 bg-slate-100">
                <BookCover
                  src={values.image}
                  alt={previewBook.title}
                  sizes="300px"
                />
              </div>
              <div className="p-5">
                <Badge variant="teal">{previewBook.category}</Badge>
                <h3 className="mt-3 line-clamp-2 font-display text-xl font-semibold leading-snug text-ink">
                  {previewBook.title}
                </h3>
                <p className="mt-1 text-sm text-muted">by {previewBook.author}</p>
                <p className="mt-3 text-xs font-semibold text-brand">
                  {previewBook.totalCopies}{" "}
                  {previewBook.totalCopies === 1 ? "copy" : "copies"} available
                </p>
              </div>
            </div>
          </aside>
        ) : null}
      </div>
    </form>
  );
}