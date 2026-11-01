"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookMarked,
  BookOpen,
  BookPlus,
  CalendarDays,
  Mail,
  Library,
  Pencil,
  UserRound,
} from "lucide-react";
import AuthGate from "@/components/shared/AuthGate";
import ProfileModal from "@/components/shared/ProfileModal";
import Alert from "@/components/ui/Alert";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Skeleton from "@/components/ui/Skeleton";
import { apiRequest } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import type { BooksResponse, BorrowsResponse } from "@/lib/types";
import { formatDate, initials } from "@/lib/utils";
import Image from "next/image";

function ProfileContent() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [booksAdded, setBooksAdded] = useState<number | null>(null);
  const [activeLoans, setActiveLoans] = useState<number | null>(null);
  const [returned, setReturned] = useState<number | null>(null);
  const [error, setError] = useState("");

  // ✅ মোডাল ওপেন/ক্লোজ করার স্টেট
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;

    Promise.all([
      apiRequest<BooksResponse>(`/books?addedBy=${encodeURIComponent(user.id)}&limit=1`),
      apiRequest<BorrowsResponse>(`/borrows?userId=${encodeURIComponent(user.id)}`),
    ])
      .then(([bookData, borrowData]) => {
        if (!active) return;
        setBooksAdded(bookData.total);
        setActiveLoans(
          borrowData.borrows.filter((borrow) => borrow.returnedAt === null).length,
        );
        setReturned(
          borrowData.borrows.filter((borrow) => borrow.returnedAt !== null).length,
        );
      })
      .catch((err: Error) => {
        if (active) setError(err.message);
      });

    return () => {
      active = false;
    };
  }, [user]);

  if (!user) return null;

  const memberSince = user.createdAt
    ? formatDate(user.createdAt as unknown as string)
    : "Recently";

  return (
    <>
      <section className="border-b border-line bg-white">
        <Container className="py-14 sm:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
            Your account
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            My Profile
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
            A quiet overview of your reading life at BookNook.
          </p>
        </Container>
      </section>

      <section className="bg-canvas py-10 sm:py-12">
        <Container>
          {error ? (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          ) : null}

          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div className="rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    height={80}
                    width={80}
                    className="rounded-2xl object-cover ring-4 ring-brand-soft"
                  />
                ) : (
                  <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand text-2xl font-semibold text-white ring-4 ring-brand-soft">
                    {initials(user.name)}
                  </span>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-2xl font-semibold text-ink">
                        {user.name}
                      </h2>
                      <Badge variant="teal">Reader</Badge>
                    </div>

                    {/* ✅ Edit Profile বাটন */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditModalOpen(true)}
                    >
                      <Pencil className="h-3.5 w-3.5 mr-1.5" />
                      Edit Profile
                    </Button>
                  </div>

                  <p className="mt-2 flex items-center gap-2 text-sm text-muted">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    <span className="truncate">{user.email}</span>
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-muted">
                    <CalendarDays className="h-4 w-4" aria-hidden="true" />
                    Member since {memberSince}
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-line pt-6">
                <h3 className="font-display text-xl font-semibold text-ink">
                  Reading snapshot
                </h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-canvas p-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-brand shadow-sm">
                      <BookOpen className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="mt-3 font-display text-2xl font-semibold text-ink">
                      {booksAdded ?? <Skeleton className="h-7 w-8" />}
                    </div>
                    <p className="text-xs text-muted">Books added</p>
                  </div>
                  <div className="rounded-2xl bg-canvas p-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-brand shadow-sm">
                      <BookMarked className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="mt-3 font-display text-2xl font-semibold text-ink">
                      {activeLoans ?? <Skeleton className="h-7 w-8" />}
                    </div>
                    <p className="text-xs text-muted">Active borrows</p>
                  </div>
                  <div className="rounded-2xl bg-canvas p-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-brand shadow-sm">
                      <Library className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="mt-3 font-display text-2xl font-semibold text-ink">
                      {returned ?? <Skeleton className="h-7 w-8" />}
                    </div>
                    <p className="text-xs text-muted">Books returned</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
              <h2 className="font-display text-xl font-semibold text-ink">
                Quick actions
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Keep your shelf and reading list moving.
              </p>

              <div className="mt-6 space-y-3">
                <Link
                  href="/my-books"
                  className="flex w-full items-center justify-start gap-2 rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:border-brand/40 hover:text-brand"
                >
                  <Library className="h-4 w-4 text-brand" aria-hidden="true" />
                  Manage My Books
                </Link>
                <Link
                  href="/my-borrows"
                  className="flex w-full items-center justify-start gap-2 rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:border-brand/40 hover:text-brand"
                >
                  <BookMarked className="h-4 w-4 text-brand" aria-hidden="true" />
                  View My Borrows
                </Link>
                <Link
                  href="/add-book"
                  className="flex w-full items-center justify-start gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark"
                >
                  <BookPlus className="h-4 w-4" aria-hidden="true" />
                  Add a New Book
                </Link>
              </div>

              <div className="mt-8 rounded-2xl bg-brand-soft p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-brand-dark">
                  <UserRound className="h-4 w-4" aria-hidden="true" />
                  A small reading note
                </p>
                <p className="mt-2 text-sm leading-6 text-brand-dark/80">
                  Return books when you are finished so the next reader can
                  find them. Good shelves stay in motion.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ✅ মোডাল রেন্ডার */}
      <ProfileModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
}

export default function ProfilePage() {
  return (
    <AuthGate>
      <ProfileContent />
    </AuthGate>
  );
}