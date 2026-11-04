import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, UserRound } from "lucide-react";
import { cn, initials } from "@/lib/utils";
import Image from "next/image";
import type { User } from "better-auth";
import ThemeToggle from "@/components/shared/ThemeToggle"; // ✅ নতুন ইম্পোর্ট

type MobileMenuProps = {
  isOpen: boolean;
  links: { name: string; href: string }[];
  user: User | null;
  isPending: boolean;
  onLogout: () => void;
  isLoggingOut: boolean;
};

export default function MobileMenu({
  isOpen,
  links,
  user,
  isPending,
  onLogout,
  isLoggingOut,
}: MobileMenuProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div
      id="mobile-navigation"
      // ✅ bg-white থেকে bg-paper করা হলো
      className="max-h-[calc(100vh-72px)] overflow-y-auto border-t border-line bg-paper px-4 pb-6 pt-3 shadow-xl animate-fade-in lg:hidden"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-1">
        {links.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-xl px-4 py-3 text-sm font-semibold transition",
                active
                  ? "bg-brand-soft text-brand-soft-foreground"
                  : "text-muted hover:bg-canvas hover:text-brand", // ✅ text-slate-600 থেকে text-muted
              )}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      <div className="mx-auto mt-4 max-w-7xl border-t border-line pt-4">
        {isPending ? (
          <div className="h-11 animate-pulse rounded-xl bg-surface-muted" />
        ) : user ? (
          <div className="space-y-3">
            {/* ✅ bg-slate-50 থেকে bg-canvas */}
            <div className="flex items-center gap-3 rounded-2xl bg-canvas p-3 border border-line">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  height={40}
                  width={40}
                  className="rounded-full object-cover"
                />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-surface text-sm font-semibold text-white">
                  {initials(user.name)}
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">
                  {user.name}
                </p>
                <p className="truncate text-xs text-muted">{user.email}</p>
              </div>
            </div>

            <Link
              href="/profile"
              // ✅ text-slate-600 থেকে text-muted, hover:bg-slate-50 থেকে hover:bg-canvas
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-muted transition hover:bg-canvas hover:text-brand"
            >
              <UserRound className="h-4 w-4" aria-hidden="true" />
              My Profile
            </Link>

            {/* ✅ থিম টগল বাটন */}
            <div className="flex items-center justify-between rounded-xl px-4 py-3 border border-line bg-canvas">
              <span className="text-sm font-semibold text-ink">Appearance</span>
              <ThemeToggle />
            </div>

            <button
              type="button"
              onClick={onLogout}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-danger transition hover:bg-danger-surface disabled:opacity-60"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              {isLoggingOut ? "Logging out…" : "Logout"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {/* ✅ থিম টগল বাটন (লগআউট অবস্থায়) */}
            <div className="flex items-center justify-between rounded-xl px-4 py-3 border border-line bg-canvas">
              <span className="text-sm font-semibold text-ink">Appearance</span>
              <ThemeToggle />
            </div>

            <div className="flex gap-3 mt-2">
              <Link
                href="/login"
                className="flex-1 rounded-xl border border-line py-3 text-center text-sm font-semibold text-ink transition hover:border-brand/40 hover:text-brand"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="flex-1 rounded-xl bg-brand-surface py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-dark"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}