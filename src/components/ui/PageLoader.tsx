import { Loader2 } from "lucide-react";

export default function PageLoader({
  label = "Loading",
}: {
  label?: string;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-muted">
      <Loader2 className="h-7 w-7 animate-spin text-brand" aria-hidden="true" />
      <p className="text-sm font-medium">{label}…</p>
      <span className="sr-only" role="status">
        {label}
      </span>
    </div>
  );
}
