import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter, Playfair_Display, Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { ToastProvider } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "BookNook — Discover Your Next Favorite Book",
    template: "%s | BookNook",
  },
  description:
    "A calm, modern library for discovering, borrowing, and sharing books you will love.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn(inter.variable, playfair.variable, "font-sans", geist.variable)}>
      <body className="flex min-h-screen flex-col bg-canvas font-sans text-ink antialiased">
        <ToastProvider>
          <Suspense
            fallback={<div className="h-[72px] border-b border-line bg-white" />}
          >
            <Navbar />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
