import Skeleton from "@/components/ui/Skeleton";

export default function BookGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm"
        >
          
          <Skeleton className="h-64 w-full rounded-none" />

          <div className="flex flex-1 flex-col p-5">
            <Skeleton className="h-3 w-16 mb-3" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="mt-2 h-4 w-1/2" />
            <div className="mt-auto pt-5">
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}