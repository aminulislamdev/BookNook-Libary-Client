import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AlertVariant = "error" | "success" | "info";

const config: Record<
  AlertVariant,
  { classes: string; icon: typeof AlertCircle }
> = {
  error: {
    classes: "border-danger-border bg-danger-surface text-danger",
    icon: AlertCircle,
  },
  success: {
    classes: "border-success-border bg-success-surface text-success",
    icon: CheckCircle2,
  },
  info: {
    classes: "border-info-border bg-info-surface text-info",
    icon: Info,
  },
};

export default function Alert({
  variant = "info",
  children,
  className,
}: {
  variant?: AlertVariant;
  children: ReactNode;
  className?: string;
}) {
  const { classes, icon: Icon } = config[variant];

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm leading-6",
        classes,
        className,
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}
