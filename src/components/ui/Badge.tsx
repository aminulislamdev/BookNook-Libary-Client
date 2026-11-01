import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "teal" | "slate" | "amber" | "red" | "green";

const variants: Record<BadgeVariant, string> = {
  teal: "bg-brand-soft text-brand-dark",
  slate: "bg-slate-100 text-slate-600",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
  green: "bg-emerald-50 text-emerald-700",
};

export default function Badge({
  children,
  variant = "teal",
  className,
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
