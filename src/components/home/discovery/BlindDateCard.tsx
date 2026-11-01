"use client";

import { useState } from "react";
import { Gift, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const MOCK_BOOKS = [
  "The Little Prince",
  "Gone Girl",
  "Sapiens",
  "Harry Potter",
  "The Silent Patient",
  "Dune",
  "Anne of Green Gables",
];

export default function BlindDateCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [randomBook, setRandomBook] = useState<string | null>(null);

  const handleBlindDate = () => {
    if (isFlipped) return; // একবার ফ্লিপ হলে আর র‍্যান্ডম হবে না
    const random = MOCK_BOOKS[Math.floor(Math.random() * MOCK_BOOKS.length)];
    setRandomBook(random);
    setIsFlipped(true);
  };

  return (
    <div className="relative group rounded-3xl bg-paper border border-line p-8 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
          <Gift className="h-5 w-5" />
        </span>
        <h3 className="font-display text-2xl font-semibold text-ink">Blind Date with a Book</h3>
      </div>

      <p className="text-muted mb-8 max-w-sm">
        Don&#39;t judge a book by its cover. Click below to unwrap a surprise read hand-picked by our librarians.
      </p>

      {/* 3D Flip Card */}
      <div
        className="relative h-48 w-full perspective-[1000px] cursor-pointer"
        onClick={handleBlindDate}
      >
        <div className={`relative h-full w-full transition-transform duration-700 transform-3d ${isFlipped ? 'transform-[rotateY(180deg)]' : ''}`}>

          {/* Front (Unopened) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-linear-to-br from-teal-800 to-teal-950 text-white shadow-lg backface-hidden">
            <Sparkles className="h-8 w-8 mb-3 text-teal-300 animate-pulse" />
            <p className="font-mono text-sm tracking-widest uppercase">Tap to unwrap</p>
          </div>

          {/* Back (Opened) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-paper border-2 border-brand/20 p-6 text-center shadow-lg transform-[rotateY(180deg)] backface-hidden">
            <p className="text-xs font-mono uppercase tracking-widest text-brand mb-2">Your Blind Date</p>
            <p className="font-display text-2xl font-semibold text-ink mb-4">{randomBook || "Loading..."}</p>
            <Link href="/books" className="flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-dark">
              Borrow this book <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}