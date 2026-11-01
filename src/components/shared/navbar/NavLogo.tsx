import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function NavLogo() {
  return (
    <Link
      href="/"
      className="flex shrink-0 items-center gap-2.5 rounded-lg"
      aria-label="BookNook home"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white shadow-sm shadow-teal-900/20">
        <BookOpen className="h-5.5 w-5.5" aria-hidden="true" />
      </span>
      <span className="font-display text-[1.45rem] font-semibold tracking-tight text-ink">
        Book<span className="text-brand">Nook</span>
      </span>
    </Link>
  );
}