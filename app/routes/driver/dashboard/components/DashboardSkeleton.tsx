import Navbar from "~/components/layout/Navbar";
import { Skeleton } from "~/components/ui/skeleton";

/** Full-page placeholder shown while the dashboard's first load is in flight. */
export default function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-16 pt-8 md:px-8">
        <div className="mb-6 space-y-2">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="mb-6 h-60 w-full rounded-xl" />
        <Skeleton className="mb-4 h-11 w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </main>
    </div>
  );
}
