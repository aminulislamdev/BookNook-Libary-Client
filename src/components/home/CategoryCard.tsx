import Link from "next/link";
import {
  ArrowUpRight,
  Atom,
  Baby,
  BookOpen,
  Landmark,
  Library,
} from "lucide-react";
import type { Category } from "@/lib/types";

const meta: Record<
  Category,
  { icon: typeof BookOpen; description: string; spine: string; soft: string }
> = {
  Fiction: {
    icon: BookOpen,
    description: "Stories, novels, and unforgettable characters.",
    spine: "bg-teal-700",
    soft: "bg-teal-50",
  },
  Science: {
    icon: Atom,
    description: "Big ideas, discoveries, and the way things work.",
    spine: "bg-amber-700",
    soft: "bg-amber-50",
  },
  History: {
    icon: Landmark,
    description: "The people and moments that shaped our world.",
    spine: "bg-rose-800",
    soft: "bg-rose-50",
  },
  Kids: {
    icon: Baby,
    description: "Bright, playful reads for younger book lovers.",
    spine: "bg-indigo-700",
    soft: "bg-indigo-50",
  },
  Others: {
    icon: Library,
    description: "Memoir, business, wellbeing, and everything else.",
    spine: "bg-stone-700",
    soft: "bg-stone-50",
  },
};

export default function CategoryCard({
  category,
  featured = false,
  className = "",
}: {
  category: Category;
  featured?: boolean;
  className?: string;
}) {
  const { icon: Icon, description, spine, soft } = meta[category];

  return (
    <Link
      href={`/books?category=${encodeURIComponent(category)}`}
      className={`group relative flex overflow-hidden rounded-2xl border border-line bg-paper shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-ink/15 hover:shadow-[0_20px_50px_-30px_rgba(28,25,23,0.4)] ${className}`}
    >
      <span className={`w-2 shrink-0 ${spine}`} aria-hidden="true" />

      <div className={`flex flex-1 flex-col p-6 ${featured ? "sm:p-8" : ""}`}>
        <div className="flex items-start justify-between">
          <span
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${soft} text-ink transition group-hover:scale-105`}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <ArrowUpRight
            className="h-4 w-4 text-stone-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
            aria-hidden="true"
          />
        </div>

        <h3
          className={`mt-auto pt-6 font-display font-medium text-ink ${featured ? "text-3xl sm:text-4xl" : "text-xl"
            }`}
        >
          {category}
        </h3>
        <p
          className={`mt-2 leading-6 text-muted ${featured ? "text-sm sm:text-base" : "text-sm"
            }`}
        >
          {description}
        </p>
      </div>
    </Link>
  );
}