"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cn, initials } from "@/lib/utils";
import { removeAuthToken } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";


type UserMenuProps = {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
};

export default function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const toast = useToast();


  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  async function handleLogout() {
    setIsLoggingOut(true);
    removeAuthToken();
    await authClient.signOut();
    setIsLoggingOut(false);
    setOpen(false);
    toast.success("Logged out successfully!");
    router.push("/");
    router.refresh();
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-full border border-line p-1 pr-2 transition hover:border-brand/30 hover:bg-slate-50"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open profile menu"
      >
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt={user.name}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white">
            {initials(user.name)}
          </span>
        )}
        <ChevronDown
          className={cn(
            "h-4 w-4 text-slate-500 transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="Profile menu"
          className="absolute right-0 z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-line bg-white shadow-xl animate-scale-in"
        >
          <div className="border-b border-line px-4 py-4">
            <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
            <p className="mt-1 truncate text-xs text-muted">{user.email}</p>
          </div>

          <div className="p-2">
            <Link
              href="/profile"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-brand-soft hover:text-brand-dark"
            >
              <UserRound className="h-4 w-4" aria-hidden="true" />
              My Profile
            </Link>

            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              {isLoggingOut ? "Logging out…" : "Logout"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
