import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { CATEGORIES } from "@/lib/types";
import CategoryCard from "./CategoryCard";

export default function Categories() {
  return (
    <section id="categories" className="paper-texture bg-canvas py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Find your shelf"
          title="Popular Categories"
          description="Start with a mood, a subject, or a reader in mind."
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
          <CategoryCard
            category="Fiction"
            featured
            className="lg:col-span-1 lg:row-span-2"
          />

          {CATEGORIES.filter((c) => c !== "Fiction").map((category) => (
            <CategoryCard key={category} category={category} />
          ))}
        </div>
      </Container>
    </section>
  );
}