import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import BlindDateCard from "./discovery/BlindDateCard";
import MoodStudio from "./discovery/MoodStudio";

export default function DiscoverySection() {
  return (
    <section className="bg-canvas py-20 sm:py-24 border-t border-line relative overflow-hidden">
      <Container>
        <SectionHeading
          eyebrow="Not sure what to read?"
          title="Discover Your Next Read"
          description="Let a little serendipity guide you — try a blind date with a book or match your current mood."
          align="center"
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <BlindDateCard />
          <MoodStudio />
        </div>
      </Container>
    </section>
  );
}