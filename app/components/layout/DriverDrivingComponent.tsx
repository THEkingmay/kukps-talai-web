import { useEffect, useState } from "react";
import { Link } from "react-router";
import { CarFront, ChevronRight, Clock, Phone } from "lucide-react";
import { format } from "date-fns";
import { cn } from "cn";

import { useAuth } from "../providers/AuthProvider";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";

import { getActiveAll } from "~/actions/driving-log.action";
import type { DrivingLog } from "~/types";

type ActiveDriver = {
  log: DrivingLog;
  driverId: string;
  driverName: string;
  driverPhone: string;
  profileImageUrl: string | null;
  carId: string;
  carNumber: string;
};

const LIVE_TICK_MS = 30_000;

// Full breakdown of time driven (days / hours / minutes) — never hides a unit.
function formatDrivenTime(ms: number) {
  const totalMinutes = Math.max(0, Math.floor(ms / 60_000));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  return [
    days > 0 ? `${days} วัน` : null,
    hours > 0 ? `${hours} ชม.` : null,
    `${minutes} นาที`,
  ]
    .filter(Boolean)
    .join(" ");
}

function driverInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0].charAt(0);
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
  return (first + last).toUpperCase();
}

function LiveDot({ className }: { className?: string }) {
  return (
    <span className={cn("relative flex size-2", className)}>
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
      <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
    </span>
  );
}

function DriverRow({ driver, now }: { driver: ActiveDriver; now: number }) {
  const startedAt = new Date(driver.log.startedAt).getTime();
  const elapsed = Math.max(0, now - startedAt);

  return (
    <li>
      <Link
        to={`/admin/assignments/${driver.driverId}`}
        className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none"
      >
        <div className="relative shrink-0">
          <Avatar>
            {driver.profileImageUrl && (
              <AvatarImage
                src={driver.profileImageUrl}
                alt={driver.driverName}
              />
            )}
            <AvatarFallback className="text-xs font-medium">
              {driverInitials(driver.driverName)}
            </AvatarFallback>
          </Avatar>
          <span className="absolute -right-0.5 -bottom-0.5 flex size-3 items-center justify-center rounded-full bg-background">
            <span className="size-2 rounded-full bg-emerald-500" />
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium leading-tight">
            {driver.driverName}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              <CarFront className="size-3 shrink-0" />
              {driver.carNumber}
            </span>
            {driver.driverPhone && (
              <span className="inline-flex items-center gap-1 whitespace-nowrap">
                <Phone className="size-3 shrink-0" />
                {driver.driverPhone}
              </span>
            )}
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              <Clock className="size-3 shrink-0" />
              เริ่ม {format(startedAt, "HH:mm")}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center">
          <span className="text-sm font-medium tabular-nums leading-none">
            {formatDrivenTime(elapsed)}
          </span>
        </div>

        <ChevronRight className="size-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
      </Link>
    </li>
  );
}

export default function DriverDrivingComponent() {
  const { user } = useAuth();
  const isAdmin = !!user && ["superadmin", "admin"].includes(user.role);

  const [activeLogs, setActiveLogs] = useState<ActiveDriver[]>([]);
  const [isLoading, setIsLoading] = useState(isAdmin);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!isAdmin) return;

    async function fetchActiveLogs() {
      try {
        const result = await getActiveAll();
        if (result.success) {
          setActiveLogs(result.data.data);
        } else {
          console.error("Error fetching active driving logs:", result.error);
        }
      } catch (error) {
        console.error("Error fetching active driving logs:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchActiveLogs();
  }, [isAdmin]);

  // live ticker — keep elapsed time fresh while drivers are on the road
  useEffect(() => {
    if (activeLogs.length === 0) return;
    const timer = window.setInterval(() => setNow(Date.now()), LIVE_TICK_MS);
    return () => window.clearInterval(timer);
  }, [activeLogs.length]);

  if (!isAdmin) return null;

  const count = activeLogs.length;
  const hasActive = count > 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <CarFront className="size-4" />
          {hasActive && (
            <LiveDot className="absolute top-1.5 right-1.5" />
          )}
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
            <Badge variant="secondary" className="h-5 rounded-full px-1.5 tabular-nums">
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
