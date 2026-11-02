"use client";

import { useState } from "react";
import { Gift, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const MOCK_BOOKS = [
  "The Little Prince",
  "Gone Girl",
  "Sapiens: A Brief History of Humankind",
  "Harry Potter and the Sorcerer's Stone",
  "The Silent Patient",
  "Dune",
  "Anne of Green Gables",
  "1984",
  "Pride and Prejudice",
  "The Hobbit",
  "The Alchemist",
  "To Kill a Mockingbird",
  "The Great Gatsby",
  "Atomic Habits",
  "The Catcher in the Rye",
  "The Da Vinci Code",
  "Brave New World",
  "The Hunger Games",
  "Rich Dad Poor Dad",
  "Fahrenheit 451"
];

export default function BlindDateCard() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [randomBook, setRandomBook] = useState<string | null>(null);

  const handleReveal = () => {
    if (isRevealed) return;
    const random = MOCK_BOOKS[Math.floor(Math.random() * MOCK_BOOKS.length)];
    setRandomBook(random);
    setIsRevealed(true);
  };

  return (
    <div className="relative flex h-full flex-col rounded-3xl bg-paper border border-line p-8 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
          <Gift className="h-5 w-5" />
        </span>
        <h3 className="font-display text-2xl font-semibold text-ink">Blind Date with a Book</h3>
      </div>

      <p className="text-muted mb-8 max-w-sm">
        Don&#39;t judge a book by its cover. Click below to unwrap a surprise read hand-picked by our librarians.
      </p>

    
      <div className="relative flex-1 flex items-center justify-center min-h-50">
        <div
          onClick={handleReveal}
          className={`absolute inset-0 flex flex-col items-center justify-center rounded-2xl transition-all duration-700 ease-in-out cursor-pointer overflow-hidden
            ${isRevealed ? "scale-0 opacity-0" : "scale-100 opacity-100"}
            bg-linear-to-br from-teal-800 to-teal-950 text-white shadow-lg
          `}
        >
          <Sparkles className="h-10 w-10 mb-4 text-teal-300 animate-pulse" />
          <p className="font-mono text-sm tracking-widest uppercase">Tap to unwrap</p>
        </div>

        <div
          className={`absolute inset-0 flex flex-col items-center justify-center rounded-2xl transition-all duration-700 ease-in-out
            ${isRevealed ? "scale-100 opacity-100" : "scale-50 opacity-0 pointer-events-none"}
            bg-paper border-2 border-brand/20 p-6 text-center shadow-lg
          `}
        >
          <p className="text-xs font-mono uppercase tracking-widest text-brand mb-2">Your Blind Date</p>
          <p className="font-display text-3xl font-semibold text-ink mb-6">{randomBook}</p>
          <Link
            href="/books"
            className="flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-dark transition"
          >
            Borrow this book <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}