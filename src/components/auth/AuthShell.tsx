import type { ReactNode } from "react";
import { BookOpen, CheckCircle2, Library, ShieldCheck } from "lucide-react";
import Container from "@/components/ui/Container";
import Image from "next/image";

const benefits = [
  {
    icon: Library,
    title: "A library that feels personal",
    description: "Save your place, borrow with clarity, and keep your reading life in one calm space.",
  },
  {
    icon: ShieldCheck,
    title: "Simple, transparent borrowing",
    description: "See exactly what is available, choose your return date, and manage every loan.",
  },
  {
    icon: CheckCircle2,
    title: "Share books you love",
    description: "Add titles to the collection and help another reader find their next favorite.",
  },
];

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <section className="bg-canvas paper-texture py-10 sm:py-14 min-h-[calc(100vh-80px)] flex items-center">
      <Container className="w-full">
        <div className="grid overflow-hidden rounded-4xl border border-line bg-paper shadow-[0_25px_70px_-45px_rgba(28,25,23,0.25)] lg:grid-cols-[1.05fr_0.95fr]">

       
          <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
            <div className="mx-auto w-full max-w-md">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                <BookOpen className="h-6 w-6" aria-hidden="true" />
              </span>
              <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {title}
              </h1>
              <p className="mt-3 text-sm leading-6 text-muted">{subtitle}</p>

              <div className="mt-8">{children}</div>

              <div className="mt-7 border-t border-line pt-6 text-sm text-muted">
                {footer}
              </div>
            </div>
          </div>


          <div className="relative hidden overflow-hidden bg-brand-dark p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <BookOpen
              aria-hidden="true"
              className="absolute -right-16 -top-16 h-64 w-64 text-white/5"
              strokeWidth={1}
            />
            <BookOpen
              aria-hidden="true"
              className="absolute -bottom-20 -left-16 h-56 w-56 text-white/5"
              strokeWidth={1}
            />

            <div className="relative">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-teal-300">
                Welcome to BookNook
              </p>
              <blockquote className="mt-5 font-display text-3xl font-medium leading-snug">
                “A reader lives a thousand lives before he dies.”
              </blockquote>
              <p className="mt-3 text-sm text-teal-100/70">George R. R. Martin</p>
            </div>

            <div className="relative my-10 flex-1 overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop"
                alt="A quiet reading room"
                height={400}
                width={600}
                priority
                quality={100}
                className="h-full w-full object-cover opacity-80 transition duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-brand-dark/90 via-brand-dark/20 to-transparent" />
            </div>

            <div className="relative space-y-5">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div key={benefit.title} className="flex gap-3.5">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{benefit.title}</p>
                      <p className="mt-0.5 text-sm leading-6 text-teal-50/70">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}