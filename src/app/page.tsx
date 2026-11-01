import HeroSlider from "@/components/home/HeroSlider";
import Categories from "@/components/home/Categories";
import NewArrivals from "@/components/home/NewArrivals";
import HowItWorks from "@/components/home/HowItWorks";
import CtaSection from "@/components/home/CtaSection";
import ReadingNook from "@/components/home/ReadingNook";
import DiscoverySection from "@/components/home/DiscoverySection";
import { Suspense } from "react";


export default function HomePage() {
  return (
    <main>

      <Suspense fallback={<div className="h-125 bg-ink" />}>
        <HeroSlider />
      </Suspense>


      <Categories />
      <DiscoverySection />
      <ReadingNook />
      <NewArrivals />
      <HowItWorks />
      <CtaSection />
    </main>
  );
}