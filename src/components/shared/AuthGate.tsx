"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import PageLoader from "@/components/ui/PageLoader";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (isPending || session?.user) return;
    // Read the path only in the browser so the shell can prerender.
    const redirect = encodeURIComponent(window.location.pathname || "/");
    router.replace(`/login?redirect=${redirect}`);
  }, [isPending, session, router]);

  if (isPending) return <PageLoader label="Checking your session" />;
  if (!session?.user) return <PageLoader label="Redirecting to sign in" />;

  return <>{children}</>;
}

export function InlineAuthLoader() {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-muted">
      <Loader2 className="h-4 w-4 animate-spin text-brand" aria-hidden="true" />
      Loading…
    </span>
  );
}
