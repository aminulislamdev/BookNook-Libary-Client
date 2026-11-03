import type { Metadata } from "next";
import { Inter, Playfair_Display, Geist } from "next/font/google"; 
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/shared/ThemeProvider"; 
import { ToastProvider } from "@/components/ui/Toast";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Suspense } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "BookNook - A Small Online Library",
  description: "Discover, borrow, and share books in a calm, curated library.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(inter.variable, playfair.variable, "font-sans", geist.variable)}>
      <body className="flex min-h-screen flex-col bg-canvas font-sans text-ink antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            <Suspense
              fallback={<div className="h-18 border-b border-line bg-paper" />}
            >
              <Navbar />
            </Suspense>
            <main className="flex-1">{children}</main>
            <Footer />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}