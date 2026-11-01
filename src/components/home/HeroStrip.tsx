import Container from "@/components/ui/Container";

export default function HeroStrip() {
  return (
    <div className="border-t border-stone-800 bg-ink/95">
      <Container>
        <div className="grid gap-5 py-6 font-mono text-[11px] uppercase tracking-[0.18em] text-stone-400 sm:grid-cols-3">
          <p className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-teal-400" />
            Hand-picked across five shelves
          </p>
          <p className="flex items-center gap-2 sm:justify-center">
            <span className="h-1 w-1 rounded-full bg-teal-400" />
            Clear availability, no guesswork
          </p>
          <p className="flex items-center gap-2 sm:justify-end">
            <span className="h-1 w-1 rounded-full bg-teal-400" />
            Add your own books
          </p>
        </div>
      </Container>
    </div>
  );
}