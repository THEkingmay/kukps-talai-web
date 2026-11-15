import { Link } from "react-router";
import { CarFront, ChevronRight } from "lucide-react";

import { Popover, PopoverTrigger, PopoverContent } from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import { useActiveDrivers } from "~/hooks/useActiveDrivers";
import DriverRow, { LiveDot } from "./driver-driving/DriverRow";

/** Admin top-bar popover: drivers who are currently on a shift. */
export default function DriverDrivingComponent() {
  const { isAdmin, activeLogs, isLoading, now, count, hasActive } =
    useActiveDrivers();

  if (!isAdmin) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <CarFront className="size-4" />
          {hasActive && <LiveDot className="absolute right-1.5 top-1.5" />}
          <span className="sr-only">คนขับที่กำลังขับอยู่</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-[400px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl p-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            {hasActive ? (
              <LiveDot />
            ) : (
              <span className="size-2 rounded-full bg-muted-foreground/30" />
            )}
            <h2 className="text-sm font-medium leading-none">
              คนขับที่กำลังขับอยู่
            </h2>
          </div>
          {hasActive && (
            <Badge
              variant="secondary"
              className="h-5 rounded-full px-1.5 tabular-nums"
            >
              {count}
            </Badge>
          )}
        </div>

        {/* Body */}
        {isLoading ? (
          <ul className="divide-y border-t">
            {[0, 1, 2].map((i) => (
              <li key={i} className="flex items-center gap-3 px-4 py-3">
                <Skeleton className="size-8 shrink-0 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-2/5" />
                  <Skeleton className="h-3 w-3/5" />
                </div>
                <Skeleton className="h-4 w-16" />
              </li>
            ))}
          </ul>
        ) : !hasActive ? (
          <div className="flex flex-col items-center gap-2 border-t px-4 py-10 text-center">
            <div className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <CarFront className="size-4" />
            </div>
            <p className="text-sm text-muted-foreground">
              ไม่มีคนขับที่กำลังขับอยู่ในขณะนี้
            </p>
          </div>
        ) : (
          <ul className="max-h-[min(420px,60vh)] divide-y overflow-y-auto border-t">
            {activeLogs.map((driver) => (
              <DriverRow key={driver.log.id} driver={driver} now={now} />
            ))}
          </ul>
        )}

        {/* Footer */}
        {hasActive && (
          <Link
            to="/admin/assignments"
            className="flex items-center justify-center gap-1 border-t px-4 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          >
            ดูการมอบหมายงานทั้งหมด
            <ChevronRight className="size-3" />
          </Link>
        )}
      </PopoverContent>
    </Popover>
  );
}
