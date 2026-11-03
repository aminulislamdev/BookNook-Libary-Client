import { Suspense } from "react";
import HeroSlider from "@/components/home/HeroSlider";
import Categories from "@/components/home/Categories";
import DiscoverySection from "@/components/home/DiscoverySection";
import NewArrivals from "@/components/home/NewArrivals";
import ReadingNook from "@/components/home/ReadingNook";
import ReadersWall from "@/components/home/ReadersWall"; // ✅ নতুন সেকশন
import CtaSection from "@/components/home/CtaSection";

export default function HomePage() {
  return (
    <main>
    
      <Suspense fallback={<div className="h-125 w-full bg-ink animate-pulse" />}>
        <HeroSlider />
      </Suspense>

      <Categories />
      <DiscoverySection />
      <NewArrivals />
      <ReadingNook />
      <ReadersWall />
      <CtaSection />
    </main>
  );
}