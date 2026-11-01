import { BookMarked, RotateCcw, Search } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

const steps = [
  {
    number: "01",
    title: "Discover Books",
    description:
      "Browse curated shelves by category or search for the title already on your mind.",
    icon: Search,
  },
  {
    number: "02",
    title: "Borrow Books",
    description:
      "Choose your reading window and borrow instantly. We keep availability clear and current.",
    icon: BookMarked,
  },
  {
    number: "03",
    title: "Return Books",
    description:
      "When you are finished, return the book in a click so the next reader can find it.",
    icon: RotateCcw,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-line bg-white py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Simple by design"
          title="How Borrowing Works"
          description="Three calm steps between you and your next good read."
          align="center"
        />

        <div className="relative mt-12 grid gap-6 md:grid-cols-3">
          <div
            aria-hidden="true"
            className="absolute left-[16.6%] right-[16.6%] top-10 hidden h-px bg-line md:block"
          />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article
                key={step.number}
                className="relative rounded-2xl border border-line bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white shadow-sm shadow-teal-900/20">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="font-display text-4xl font-semibold text-teal-300">
                    {step.number}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-2xl font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-sm leading-7 text-muted">
                  {step.description}
                </p>
                {index < steps.length - 1 ? (
                  <span className="sr-only">Next step</span>
                ) : null}
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
