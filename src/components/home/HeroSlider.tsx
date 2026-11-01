"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import HeroStrip from "./HeroStrip";
import { heroSlides, type Slide } from "@/data/slides";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function HeroSlider() {
  return (
    <section className="relative overflow-hidden bg-ink">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        speed={900}
        className="h-150 w-full lg:h-175"
      >
        {heroSlides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <SlideContent slide={slide} priority={index === 0} />
          </SwiperSlide>
        ))}
      </Swiper>
      <HeroStrip />
    </section>
  );
}

function SlideContent({
  slide,
  priority,
}: {
  slide: Slide;
  priority: boolean;
}) {
  return (
    <div className="relative h-full w-full">
      <Image
        src={slide.image}
        alt={slide.heading}
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover"
      />

      {/* ✅ bg-linear-to-r এর বদলে bg-gradient-to-r */}
      <div className="absolute inset-0 bg-linear-to-r from-stone-950/85 via-stone-950/55 to-stone-950/20" />
      <div className="absolute inset-0 bg-linear-to-t from-stone-950/60 via-transparent to-transparent" />

      <Container className="relative z-10 flex h-full flex-col justify-center">
        <div className="max-w-2xl">
          <p className={`font-mono text-xs uppercase tracking-[0.25em] ${slide.accent}`}>
            {slide.eyebrow}
          </p>
          <h1 className="mt-5 text-balance font-display text-[2.5rem] font-medium leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.75rem]">
            {slide.heading}
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-base leading-8 text-stone-200 sm:text-lg">
            {slide.description}
          </p>
          <div className="mt-8">
            {/* ✅ Button এর বদলে Link */}
            <Link
              href="/books"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-6 text-base font-semibold text-white shadow-sm transition hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              Browse Books
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}