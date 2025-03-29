import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto">
      {/* Page Title */}
      <Skeleton className="h-8 w-1/4 mb-4" />

      {/* Product Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-40 md:h-52 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>

      {/* Empty Wishlist State */}
      <div className="text-center mt-10">
        <Skeleton className="h-6 w-1/3 mx-auto my-4" />
        <Skeleton className="h-10 w-40 mx-auto" />
      </div>
    </div>
  );
}
