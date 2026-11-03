"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { removeAuthToken } from "@/lib/api";
import UserMenu from "@/components/shared/UserMenu";
import NavLogo from "./navbar/NavLogo";
import NavLinks from "./navbar/NavLinks";
import MobileMenu from "./navbar/MobileMenu";
import ThemeToggle from "@/components/shared/ThemeToggle"; // ✅ নতুন ইম্পোর্ট

const publicLinks = [
  { name: "Home", href: "/" },
  { name: "All Books", href: "/books" },
];

const privateLinks = [
  { name: "Add Book", href: "/add-book" },
  { name: "My Books", href: "/my-books" },
  { name: "My Borrows", href: "/my-borrows" },
];

export default function Navbar() {
  const [mobileOpenForPath, setMobileOpenForPath] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const mobileOpen = mobileOpenForPath === pathname;
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const navLinks = user ? [...publicLinks, ...privateLinks] : publicLinks;

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  async function handleLogout() {
    setIsLoggingOut(true);
    removeAuthToken();
    await authClient.signOut();
    setIsLoggingOut(false);
    setMobileOpenForPath(null);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-paper/95 backdrop-blur supports-backdrop-filter:bg-paper/90">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8"
      >
        <NavLogo />

        <NavLinks links={navLinks} />

        <div className="hidden items-center gap-3 lg:flex">
          {/* ✅ থিম টগল বাটন যোগ করা হলো */}
          <ThemeToggle />

          {isPending ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
          ) : user ? (
            <UserMenu
              user={{
                name: user.name,
                email: user.email,
                image: user.image,
              }}
            />
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl px-3.5 py-2.5 text-sm font-semibold text-ink transition hover:bg-canvas hover:text-brand"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-teal-900/10 transition hover:bg-brand-dark"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpenForPath(mobileOpen ? null : pathname)}
          className="rounded-xl p-2.5 text-ink transition hover:bg-canvas lg:hidden"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <MobileMenu
        isOpen={mobileOpen}
        links={navLinks}
        user={user ?? null}
        isPending={isPending}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />
    </header>
  );
}