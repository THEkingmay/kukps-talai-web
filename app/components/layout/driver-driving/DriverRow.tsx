import { Link } from "react-router";
import { format } from "date-fns";
import { cn } from "cn";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { formatDrivenTime, formatInitials } from "~/helper";
import type { ActiveDriver } from "~/hooks/useActiveDrivers";
import { CarFront, ChevronRight, Clock, Phone } from "lucide-react";

/** Pulsing "live" dot used by the header and trigger button. */
export function LiveDot({ className }: { className?: string }) {
  return (
    <span className={cn("relative flex size-2", className)}>
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
      <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
    </span>
  );
}

interface DriverRowProps {
  driver: ActiveDriver;
  now: number;
}

/** One active driver inside the popover list. */
export default function DriverRow({ driver, now }: DriverRowProps) {
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
              <AvatarImage src={driver.profileImageUrl} alt={driver.driverName} />
            )}
            <AvatarFallback className="text-xs font-medium">
              {formatInitials(driver.driverName)}
            </AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-0.5 -right-0.5 flex size-3 items-center justify-center rounded-full bg-background">
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
          <span className="text-sm font-medium leading-none tabular-nums">
            {formatDrivenTime(elapsed)}
          </span>
        </div>

        <ChevronRight className="size-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
      </Link>
    </li>
  );
}
