"use client";

import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Container from "@/components/ui/Container";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="bg-canvas py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-xl rounded-3xl border border-line bg-white p-8 text-center shadow-sm sm:p-12">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <AlertCircle className="h-7 w-7" aria-hidden="true" />
          </span>
          <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight text-ink">
            Something interrupted the page
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            {error.message || "An unexpected error occurred. Please try again."}
          </p>
          <Button onClick={reset} className="mt-6">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Try Again
          </Button>
        </div>
      </Container>
    </section>
  );
}
