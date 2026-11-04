"use client";

import { useState } from "react";
import { Coffee, Zap, Brain, Moon, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const MOOD_DATA = {
  relax: { label: "Relaxing", icon: Coffee, color: "bg-warning-surface text-warning", books: ["The Little Prince", "Anne of Green Gables"] },
  thrill: { label: "Thrilling", icon: Zap, color: "bg-danger-surface text-danger", books: ["Gone Girl", "The Silent Patient"] },
  learn: { label: "Learning", icon: Brain, color: "bg-info-surface text-info", books: ["Sapiens", "Thinking, Fast and Slow"] },
  escape: { label: "Escapist", icon: Moon, color: "bg-cat-kids-soft text-info", books: ["Harry Potter", "Dune"] },
};

export default function MoodStudio() {
  const [selectedMood, setSelectedMood] = useState<keyof typeof MOOD_DATA | null>(null);

  return (
    <div className="rounded-3xl bg-paper border border-line p-8 shadow-sm transition-all hover:shadow-md flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand-soft-foreground">
          <Sparkles className="h-5 w-5" />
        </span>
        <h3 className="font-display text-2xl font-semibold text-ink">Reading Mood Studio</h3>
      </div>

      <p className="text-muted mb-6">
        How are you feeling today? Select a mood and we&#39;ll find books that match your vibe.
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {(Object.keys(MOOD_DATA) as Array<keyof typeof MOOD_DATA>).map((mood) => {
          const { label, icon: Icon, color } = MOOD_DATA[mood];
          const isActive = selectedMood === mood;
          return (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${isActive ? "ring-2 ring-brand ring-offset-2 bg-paper text-ink scale-105 shadow-sm" : color
                }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          );
        })}
      </div>


      <div className="relative flex-1 min-h-45 perspective-[1000px]">
        <div
          className={`absolute inset-0 rounded-xl bg-canvas p-4 border border-line transition-all duration-500 ease-out origin-top
            ${selectedMood
              ? "opacity-100 rotate-x-0 scale-100 translate-y-0"
              : "opacity-0 rotate-x-90 scale-95 -translate-y-4 pointer-events-none"
            }
          `}
        >
          {selectedMood && (
            <>
              <p className="text-sm font-semibold text-ink mb-3">
                Perfect for your <span className="text-brand">{MOOD_DATA[selectedMood].label}</span> mood:
              </p>
              <div className="flex flex-col gap-2">
                {MOOD_DATA[selectedMood].books.map((book) => (
                  <Link
                    key={book}
                    href="/books"
                    className="flex items-center justify-between rounded-lg bg-paper p-3 text-sm text-ink transition hover:bg-brand-soft hover:text-brand-soft-foreground border border-transparent hover:border-brand/20"
                  >
                    <span>{book}</span>
                    <ArrowRight className="h-4 w-4 text-brand" />
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

   
        <div
          className={`absolute inset-0 rounded-xl border border-dashed border-line flex items-center justify-center text-sm text-muted transition-all duration-500 ease-in
            ${selectedMood ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"}
          `}
        >
          Select a mood to see recommendations
        </div>
      </div>
    </div>
  );
}