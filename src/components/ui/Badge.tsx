import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "teal" | "slate" | "amber" | "red" | "green";

const variants: Record<BadgeVariant, string> = {
  teal: "bg-brand-soft text-brand-soft-foreground",
  slate: "bg-surface-muted text-muted",
  amber: "bg-warning-surface text-warning",
  red: "bg-danger-surface text-danger",
  green: "bg-success-surface text-success",
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
