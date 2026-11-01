"use client";

import { useEffect, useState } from "react";
import { Quote, Star } from "lucide-react";
import Container from "@/components/ui/Container";

const quotes = [
  {
    text: "A reader lives a thousand lives before he dies. The man who never reads lives only one.",
    author: "George R.R. Martin",
    book: "A Dance with Dragons",
  },
  {
    text: "Until I feared I would lose it, I never loved to read. One does not love breathing.",
    author: "Harper Lee",
    book: "To Kill a Mockingbird",
  },
  {
    text: "There is no friend as loyal as a book.",
    author: "Ernest Hemingway",
    book: "Unknown",
  },
  {
    text: "We read to know we are not alone.",
    author: "C.S. Lewis",
    book: "Shadowlands",
  },
];

export default function ReadingNook() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // ✅ প্রতি ১০ সেকেন্ড (১০,০০০ মিলিসেকেন্ড) পর পর ইনডেক্স পরিবর্তন হবে
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 10000);

    // ক্লিনআপ ফাংশন: কম্পোনেন্ট আনমাউন্ট হলে ইন্টারভাল বন্ধ হবে
    return () => clearInterval(interval);
  }, []);

  const quote = quotes[currentIndex];

  return (
    <section className="relative overflow-hidden bg-brand-dark py-20 text-white sm:py-28">
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
        <span className="font-display text-[20vw] font-bold leading-none">
          Read
        </span>
      </div>

      <Container className="relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
            ))}
          </div>

          <Quote className="mx-auto mb-4 h-10 w-10 text-teal-200/50" />

          {/* ✅ key={currentIndex} দিলে টেক্সট পরিবর্তনের সময় একটি সুন্দর Fade অ্যানিমেশন হবে */}
          <div key={currentIndex} className="animate-in fade-in duration-700">
            <h2 className="font-display text-2xl font-medium leading-snug tracking-tight text-teal-50 sm:text-3xl md:text-4xl">
              &ldquo;{quote.text}&rdquo;
            </h2>

            <div className="mt-8 flex flex-col items-center justify-center gap-2">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-teal-300">
                — {quote.author}
              </span>
              <span className="text-sm text-teal-100/60 italic">
                {quote.book}
              </span>
            </div>
          </div>
        </div>
      </Container>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-amber-400/40 to-transparent" />
    </section>
  );
}