import Link from "next/link";
import { BookOpen, Mail, Phone, MapPin } from "lucide-react";
import Container from "@/components/ui/Container";
import { CATEGORIES } from "@/lib/types";

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "All Books", href: "/books" },
  { label: "Add Book", href: "/add-book" },
  { label: "My Books", href: "/my-books" },
  { label: "My Borrows", href: "/my-borrows" },
];

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.4 9.74v-8.37H5.06v8.37z" />
    </svg>
  );
}

export default function Footer() {
  const CURRENT_YEAR = 2026;

  return (
    <footer className="border-t border-line bg-paper relative overflow-hidden">

      
      <div className="absolute inset-0 paper-texture opacity-50 pointer-events-none" />

      <Container className="relative z-10 py-14 sm:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          <div className="max-w-sm">
     
            <Link href="/" className="flex items-center gap-2.5 group" aria-label="BookNook home">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-brand-surface to-brand-dark text-white shadow-md shadow-brand-surface/20 transition-transform group-hover:scale-105">
                <BookOpen className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-display text-2xl font-semibold tracking-tight text-ink">
                Book<span className="text-brand">Nook</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-6 text-muted">
              A quiet, thoughtful corner for book lovers. Discover curated stories,
              borrow titles with one click, and share your favorite reads.
            </p>

       
            <div className="mt-6 flex items-center gap-2">
              <a
                href="https://github.com/aminulislamdev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-paper text-muted shadow-sm transition hover:-translate-y-0.5 hover:border-brand/30 hover:text-brand hover:shadow-md"
                aria-label="BookNook GitHub"
              >
                <GithubIcon className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/aminulislamjs/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-paper text-muted shadow-sm transition hover:-translate-y-0.5 hover:border-brand/30 hover:text-brand hover:shadow-md"
                aria-label="BookNook LinkedIn"
              >
                <LinkedInIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-mono text-[14px] font-bold uppercase tracking-[0.2em] text-brand">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition hover:text-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-[14px] font-bold uppercase tracking-[0.2em] text-brand">
              Categories
            </h3>
            <ul className="mt-4 space-y-3">
              {CATEGORIES.map((category) => (
                <li key={category}>
                  <Link
                    href={`/books?category=${encodeURIComponent(category)}`}
                    className="text-sm text-muted transition hover:text-brand"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-[14px] font-bold uppercase tracking-[0.2em] text-brand">
              Contact & Info
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-brand shrink-0" aria-hidden="true" />
                <a
                  href="mailto:aminulislam424842@gmail.com"
                  className="transition hover:text-brand"
                >
                  aminulislam424842@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-brand shrink-0" aria-hidden="true" />
                <span>+880 1709150885</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-brand shrink-0" aria-hidden="true" />
                <span>Rajshahi, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {CURRENT_YEAR} BookNook. All rights reserved.</p>
          <p className="font-mono text-[10px] uppercase tracking-widest">
            Curated with care for readers worldwide.
          </p>
        </div>
      </Container>
    </footer>
  );
}