"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Check, X } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import PasswordInput from "@/components/auth/PasswordInput";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import PageLoader from "@/components/ui/PageLoader";
import { FieldError, Input, Label } from "@/components/ui/Form";
import { useToast } from "@/components/ui/Toast";
import { authClient } from "@/lib/auth-client";
import { safeRedirect } from "@/lib/utils";
import { apiRequest, setAuthToken } from "@/lib/api";

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = safeRedirect(searchParams.get("redirect"));
  const { data: session, isPending } = authClient.useSession();
  const toast = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    if (!isPending && session?.user) {
      router.replace(redirect);
    }
  }, [isPending, session, router, redirect]);

  // Real-time password feedback
  const hasMinLength = password.length >= 8;
  const hasMatch = password.length > 0 && password === confirmPassword;

  async function handleGoogleSignUp() {
    setIsGoogleLoading(true);
    setError("");
    try {
      const res = await authClient.signIn.social({
        provider: "google",
        callbackURL: redirect,
      });
      if (res?.error) {
        setError(res.error.message || "Google sign-up could not be completed.");
      }
    } catch {
      setError("Google authentication service is ready to configure with Google Cloud client credentials.");
      toast.info("Google sign-in is prepared for OAuth client registration.");
    } finally {
      setIsGoogleLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFieldError("");

    if (name.trim().length < 2) {
      setFieldError("Please enter your full name.");
      return;
    }

    if (password.length < 8) {
      setFieldError("Your password needs at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setFieldError("The two passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    const { data: authData, error: authError } = await authClient.signUp.email({
      name: name.trim(),
      email: email.trim(),
      password,
      image: image.trim() || undefined,
    });

    if (authError) {
      setError(authError.message ?? "Could not create your account. Please try again.");
      setIsSubmitting(false);
      return;
    }

    // Fetch JWT token for backend authorization
    try {
      const user = authData?.user;
      if (user) {
        const jwtRes = await apiRequest<{ token: string }>("/jwt", {
          method: "POST",
          body: { id: user.id, email: user.email, name: user.name },
        });
        if (jwtRes.token) {
          setAuthToken(jwtRes.token);
        }
      }
    } catch (e) {
      console.warn("Could not retrieve initial JWT:", e);
    }

    toast.success("Account created successfully! Welcome to BookNook.");
    router.push(redirect);
    router.refresh();
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join a calm, curated library and start borrowing in a few clicks."
      footer={
        <p>
          Already have an account?{" "}
          <Link
            href={`/login${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
            className="font-semibold text-brand transition hover:text-brand-dark"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <div className="space-y-5">
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignUp}
          disabled={isGoogleLoading || isSubmitting}
          className="w-full justify-center gap-3 py-2.5 font-medium text-slate-700 bg-white hover:bg-slate-50 border-line"
        >
          <GoogleIcon />
          {isGoogleLoading ? "Connecting to Google…" : "Continue with Google"}
        </Button>

        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-line" />
          <span className="absolute bg-white px-3 text-xs uppercase tracking-wider text-muted">
            Or register with email
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <Label htmlFor="register-name">Full name</Label>
            <Input
              id="register-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Alex Morgan"
              autoComplete="name"
              required
            />
          </div>

          <div>
            <Label htmlFor="register-email">Email address</Label>
            <Input
              id="register-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <Label htmlFor="register-photo">Photo URL (Optional)</Label>
            <Input
              id="register-photo"
              type="url"
              value={image}
              onChange={(event) => setImage(event.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="register-password">Password</Label>
              <PasswordInput
                id="register-password"
                value={password}
                onChange={setPassword}
                autoComplete="new-password"
              />
            </div>
            <div>
              <Label htmlFor="register-confirm">Confirm password</Label>
              <PasswordInput
                id="register-confirm"
                value={confirmPassword}
                onChange={setConfirmPassword}
                autoComplete="new-password"
              />
            </div>
          </div>

          {/* Password Validation Feedback */}
          {password.length > 0 && (
            <div className="rounded-xl border border-line bg-slate-50 p-3 space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                {hasMinLength ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <X className="h-3.5 w-3.5 text-slate-400" />
                )}
                <span className={hasMinLength ? "text-emerald-700 font-medium" : "text-slate-500"}>
                  At least 8 characters
                </span>
              </div>
              {confirmPassword.length > 0 && (
                <div className="flex items-center gap-2">
                  {hasMatch ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <X className="h-3.5 w-3.5 text-rose-500" />
                  )}
                  <span className={hasMatch ? "text-emerald-700 font-medium" : "text-rose-600"}>
                    Passwords match
                  </span>
                </div>
              )}
            </div>
          )}

          <FieldError>{fieldError}</FieldError>

          {error ? <Alert variant="error">{error}</Alert> : null}

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Creating account…" : "Create Account"}
            {!isSubmitting ? (
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            ) : null}
          </Button>

          <p className="text-xs leading-5 text-muted">
            By creating an account you agree to treat the shared shelves with care
            and return borrowed books on time.
          </p>
        </form>
      </div>
    </AuthShell>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<PageLoader label="Loading registration" />}>
      <RegisterForm />
    </Suspense>
  );
}
