import { Panel } from "@/components/ui/Panel";
import { Skeleton } from "@/components/ui/skeleton";

export function AnalyticsSkeleton() {
  return (
    <div className="mt-6 space-y-6">
      <Panel className="p-0 overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          <div className="flex-1 px-6 py-4 border-b sm:border-b-0 sm:border-r border-border dark:border-white/[0.06]">
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-8 w-20" />
          </div>
          <div className="flex-1 px-6 py-4 border-b sm:border-b-0 sm:border-r border-border dark:border-white/[0.06]">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-8 w-24" />
          </div>
          <div className="flex-1 px-6 py-4">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
        <div className="h-[350px] w-full px-6 pb-6 pt-4">
          <Skeleton className="h-full w-full rounded-lg" />
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Panel className="p-4 space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-4/6" />
            </Panel>
            <Panel className="p-4 space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-4/6" />
            </Panel>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-[180px] rounded-lg" />
            <Panel className="p-4 space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-4/6" />
            </Panel>
          </div>
        </div>
        <Panel className="p-4 space-y-3">
          <Skeleton className="h-4 w-28" />
          <div className="space-y-2 pt-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-2 w-2 shrink-0 rounded-full" />
                <Skeleton className="h-3 flex-1" />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
