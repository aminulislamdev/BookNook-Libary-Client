"use client";

import { Quote, Star } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

const reviews = [
  {
    id: 1,
    quote: "The Alchemist taught me that the universe conspires in helping you achieve your dreams.",
    reader: "Aminul Islam",
    book: "The Alchemist",
    color: "bg-warning-surface border-warning-border",
    rotate: "-rotate-2",
  },
  {
    id: 2,
    quote: "A must-read for anyone who loves sci-fi. The world-building in Dune is unmatched.",
    reader: "Sara Khan",
    book: "Dune",
    color: "bg-brand-soft border-line",
    rotate: "rotate-1",
  },
  {
    id: 3,
    quote: "I couldn't put this down! The Silent Patient has the best plot twist I've ever read.",
    reader: "Rahat Hossain",
    book: "The Silent Patient",
    color: "bg-danger-surface border-danger-border",
    rotate: "-rotate-1",
  },
];

export default function ReadersWall() {
  return (
    <section className="bg-canvas py-20 sm:py-24 border-t border-line relative overflow-hidden">
      {/* ব্যাকগ্রাউন্ড ডট প্যাটার্ন (ঐচ্ছিক) */}
      <div className="absolute inset-0 paper-texture opacity-50 pointer-events-none" />

      <Container className="relative z-10">
        <SectionHeading
          eyebrow="From the community"
          title="The Reader's Wall"
          description="Little notes from readers about the books that stayed with them."
          align="center"
        />

        <div className="mt-16 flex flex-wrap justify-center gap-6 sm:gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className={`relative w-full max-w-xs rounded-sm border p-6 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md ${review.color} ${review.rotate}`}
            >
              {/* পিন বা টেপ ইফেক্ট */}
              <div className="absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 rotate-3 bg-white/60 shadow-sm backdrop-blur-sm dark:bg-white/10" />

              <div className="flex gap-1 mb-4 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>

              <Quote className="h-6 w-6 text-ink/10 mb-2" />

              <p className="text-sm leading-relaxed text-ink/80 italic">
                &ldquo;{review.quote}&rdquo;
              </p>

              <div className="mt-6 flex flex-col border-t border-line pt-4">
                <span className="font-display font-semibold text-ink text-sm">
                  — {review.reader}
                </span>
                <span className="text-xs text-muted mt-0.5">
                  reading <span className="font-semibold">{review.book}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}