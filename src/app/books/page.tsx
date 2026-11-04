import { Suspense } from "react";
import AllBooksClient from "@/components/books/AllBooksClient";
import BookGridSkeleton from "@/components/books/BookGridSkeleton";
import Container from "@/components/ui/Container";
import Skeleton from "@/components/ui/Skeleton";

export const metadata = {
  title: "All Books",
  description: "Explore the full BookNook collection.",
};

function BooksFallback() {
  return (
    <>
      <section className="border-b border-line bg-paper">
        <Container className="py-14 sm:py-16">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="mt-4 h-12 w-96 max-w-full" />
          <Skeleton className="mt-4 h-5 w-full max-w-xl" />
        </Container>
      </section>
      <section className="bg-canvas py-10 sm:py-12">
        <Container>
          <Skeleton className="h-24 w-full rounded-2xl" />
          <div className="mt-8">
            <BookGridSkeleton count={9} />
          </div>
        </Container>
      </section>
    </>
  );
}

export default function BooksPage() {
  return (
    <Suspense fallback={<BooksFallback />}>
      <AllBooksClient />
    </Suspense>
  );
}
