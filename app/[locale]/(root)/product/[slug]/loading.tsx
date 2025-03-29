import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-4">
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Left: Product Gallery Skeleton */}
          <div className="col-span-2">
            <Skeleton className="w-full h-[400px] md:h-[500px] rounded-lg bg-gray-300 dark:bg-gray-700" />
          </div>

          {/* Middle: Product Info Skeleton */}
          <div className="flex w-full flex-col gap-4 md:p-5 col-span-2">
            <Skeleton className="h-6 w-3/4 bg-gray-400 dark:bg-gray-700" />
            <Skeleton className="h-8 w-full bg-gray-300 dark:bg-gray-700" />
            <Skeleton className="h-5 w-1/2 bg-gray-300 dark:bg-gray-700" />
            <Skeleton className="h-6 w-32 bg-gray-300 dark:bg-gray-700" />
            <Skeleton className="h-10 w-40 bg-gray-300 dark:bg-gray-700" />
            <Skeleton className="h-5 w-2/3 bg-gray-300 dark:bg-gray-700" />
            <Skeleton className="h-10 w-full bg-gray-300 dark:bg-gray-700" />
            <Skeleton className="h-40 w-full bg-gray-300 dark:bg-gray-700" />
          </div>

          {/* Right: Purchase Options Skeleton */}
          <div>
            <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg flex flex-col gap-4">
              <Skeleton className="h-8 w-20 bg-gray-300 dark:bg-gray-700" />
              <Skeleton className="h-6 w-1/3 bg-gray-300 dark:bg-gray-700" />
              <Skeleton className="h-12 w-full bg-gray-300 dark:bg-gray-700" />
              <Skeleton className="h-12 w-full bg-gray-300 dark:bg-gray-700" />
              <Skeleton className="h-12 w-full bg-gray-300 dark:bg-gray-700" />
            </div>
          </div>
        </div>
      </section>

      {/* Share Product */}
      <div className="flex flex-col gap-2 my-4">
        <Skeleton className="h-6 w-48 bg-gray-300 dark:bg-gray-700" />
        <Skeleton className="h-10 w-full md:w-1/2 bg-gray-300 dark:bg-gray-700" />
      </div>

      {/* Reviews Section */}
      <section className="mt-10">
        <Skeleton className="h-6 w-1/3 bg-gray-300 dark:bg-gray-700" />
        <div className="mt-2 flex flex-col gap-4">
          <Skeleton className="h-16 w-full bg-gray-300 dark:bg-gray-700" />
          <Skeleton className="h-16 w-full bg-gray-300 dark:bg-gray-700" />
          <Skeleton className="h-16 w-full bg-gray-300 dark:bg-gray-700" />
        </div>
      </section>

      {/* Related Products */}
      <section className="mt-10">
        <Skeleton className="h-6 w-1/3 bg-gray-300 dark:bg-gray-700" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          <Skeleton className="h-40 w-full rounded-lg bg-gray-300 dark:bg-gray-700" />
          <Skeleton className="h-40 w-full rounded-lg bg-gray-300 dark:bg-gray-700" />
          <Skeleton className="h-40 w-full rounded-lg bg-gray-300 dark:bg-gray-700" />
          <Skeleton className="h-40 w-full rounded-lg bg-gray-300 dark:bg-gray-700" />
        </div>
      </section>
    </div>
  );
}
