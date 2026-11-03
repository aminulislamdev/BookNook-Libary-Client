"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import PasswordInput from "@/components/auth/PasswordInput";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import PageLoader from "@/components/ui/PageLoader";
import { FieldError, Input, Label } from "@/components/ui/Form";
import { useToast } from "@/components/ui/Toast";
import { authClient } from "@/lib/auth-client";
import { safeRedirect } from "@/lib/utils";

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
    </svg>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = safeRedirect(searchParams.get("redirect"));
  const { data: session, isPending } = authClient.useSession();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    if (!isPending && session?.user) {
      router.replace(redirect);
    }
  }, [isPending, session, router, redirect]);

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);
    setError("");
    try {
      const res = await authClient.signIn.social({
        provider: "google",
        callbackURL: redirect,
      });
      if (res?.error) {
        setError(res.error.message || "Google sign-in could not be completed.");
        toast.error(res.error.message || "Google sign-in failed.");
      }
    } catch {
      setError("Google authentication service is not configured on this environment.");
      toast.info("Google authentication is ready to configure with Google Cloud client credentials.");
    } finally {
      setIsGoogleLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFieldError("");

    if (!email.trim()) {
      setFieldError("Please enter your email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: authError } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(authError.message ?? "Could not sign you in. Check your details.");
        toast.error(authError.message ?? "Invalid email or password.");
        setIsSubmitting(false);
        return;
      }

      toast.success("Welcome back! Signed in successfully.");

      // ✅ সেশন আপডেট করে সরাসরি ডেস্টিনেশনে পাঠাও
      await authClient.getSession();
      router.replace(redirect);
      router.refresh();
    } catch {
      setError("Could not sign you in. Please try again.");
      toast.error("Could not sign you in. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to borrow books, manage your loans, and add titles to the collection."
      footer={
        <p>
          New to BookNook?{" "}
          <Link
            href={`/register${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
            className="font-semibold text-brand transition hover:text-brand-dark"
          >
            Create an account
          </Link>
        </p>
      }
    >
      <div className="space-y-5">
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isSubmitting}
          className="w-full justify-center gap-3 py-2.5 font-medium text-slate-700 bg-white hover:bg-slate-50 border-line"
        >
          <GoogleIcon />
          {isGoogleLoading ? "Connecting to Google…" : "Continue with Google"}
        </Button>

        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-line" />
          <span className="absolute bg-white px-3 text-xs uppercase tracking-wider text-muted">
            Or sign in with email
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <Label htmlFor="login-email">Email address</Label>
            <Input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="login-password">Password</Label>
              <button
                type="button"
                onClick={() => toast.info("Password reset feature will be emailed to you.")}
                className="text-xs font-semibold text-brand hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <PasswordInput
              id="login-password"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
            />
            <FieldError>{fieldError}</FieldError>
          </div>

          {error ? <Alert variant="error">{error}</Alert> : null}

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Signing in…" : "Sign In"}
            {!isSubmitting ? (
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            ) : null}
          </Button>
        </form>
      </div>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<PageLoader label="Loading sign in" />}>
      <LoginForm />
    </Suspense>
  );
}