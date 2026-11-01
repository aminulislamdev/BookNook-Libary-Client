import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, UserRound } from "lucide-react";
import { cn, initials } from "@/lib/utils";
import Image from "next/image";
import type { User } from "better-auth";

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
      className="max-h-[calc(100vh-72px)] overflow-y-auto border-t border-line bg-white px-4 pb-6 pt-3 shadow-xl animate-fade-in lg:hidden"
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
                  ? "bg-brand-soft text-brand-dark"
                  : "text-slate-600 hover:bg-slate-50 hover:text-brand",
              )}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      <div className="mx-auto mt-4 max-w-7xl border-t border-line pt-4">
        {isPending ? (
          <div className="h-11 animate-pulse rounded-xl bg-slate-100" />
        ) : user ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  height={40}
                  width={40}
                  className="rounded-full object-cover"
                />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
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
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-brand"
            >
              <UserRound className="h-4 w-4" aria-hidden="true" />
              My Profile
            </Link>

            <button
              type="button"
              onClick={onLogout}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              {isLoggingOut ? "Logging out…" : "Logout"}
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <Link
              href="/login"
              className="flex-1 rounded-xl border border-line py-3 text-center text-sm font-semibold text-ink transition hover:border-brand/40 hover:text-brand"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="flex-1 rounded-xl bg-brand py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}