export type Slide = {
  id: number;
  image: string;
  eyebrow: string;
  heading: string;
  description: string;
  accent: string;
};

export const heroSlides: Slide[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop",
    eyebrow: "The reading room",
    heading: "Take your time. Find something worth staying for.",
    description:
      "A thoughtfully curated shelf, a clear borrowing window, and no rush to finish. Just books that catch your eye.",
    accent: "text-teal-200",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2000&auto=format&fit=crop",
    eyebrow: "Borrow in one click",
    heading: "Pick a book. Keep it for a while. Return it gently.",
    description:
      "Choose your reading window and borrow instantly. Availability stays clear, so you always know what's on the shelf.",
    accent: "text-amber-200",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2000&auto=format&fit=crop",
    eyebrow: "Your shelf, your pace",
    heading: "A library that fits the way you actually read.",
    description:
      "Add your own books, track what you've borrowed, and return in a click. A reading room that moves with your life.",
    accent: "text-teal-200",
  },
];