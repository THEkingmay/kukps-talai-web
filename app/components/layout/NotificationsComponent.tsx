import {
  AlertTriangle,
  Bell,
  BellOff,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";
import { cn } from "cn";
import { useAuth } from "~/components/providers/AuthProvider";
import {
  useNotificationProvider,
  type NotificationRange,
} from "~/components/providers/NotificationProvider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";

import { formatDate } from "~/helper";

const RANGE_OPTIONS: { value: NotificationRange; label: string }[] = [
  { value: "1d", label: "24 ชม." },
  { value: "7d", label: "7 วัน" },
  { value: "30d", label: "30 วัน" },
  { value: "all", label: "ทั้งหมด" },
];

const MAX_ITEMS = 30;

function NotificationSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex gap-3">
          <Skeleton className="size-4 shrink-0 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-4/5" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function NotificationError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        <RefreshCw className="size-3.5" />
        ลองใหม่
      </Button>
    </div>
  );
}

function NotificationEmpty() {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
      <BellOff className="size-5 text-muted-foreground/50" />
      <p className="text-sm text-muted-foreground">
        ยังไม่มีการแจ้งเตือนในช่วงนี้
      </p>
    </div>
  );
}

export default function NotificationsComponent() {
  const { user } = useAuth();
  const { notifications, isLoading, error, range, setRange, retry } =
    useNotificationProvider();

  const canView = user?.role === "admin" || user?.role === "superadmin";
  if (!canView) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="size-4" />
          <span className="sr-only">การแจ้งเตือน</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[400px] max-w-[calc(100vw-2rem)] rounded-xl p-0"
      >
        {/* Header */}
        <div className="px-4 py-3">
          <h2 className="text-sm font-medium leading-none">การแจ้งเตือน</h2>
        </div>

        {/* Range filter */}
        <div className="flex items-center gap-1.5 border-y bg-muted/40 px-4 py-2.5">
          {RANGE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setRange(option.value)}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs transition-colors",
                range === option.value
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Body */}
        {isLoading ? (
          <NotificationSkeleton />
        ) : error ? (
          <NotificationError message={error} onRetry={retry} />
        ) : notifications.length === 0 ? (
          <NotificationEmpty />
        ) : (
          <div className="max-h-[min(420px,60vh)] overflow-y-auto">
            <ul className="divide-y px-2 py-1">
              {notifications.slice(0, MAX_ITEMS).map((notification) => (
                <li key={notification.id} className="flex gap-3 px-2 py-2.5">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm leading-snug">
                      {notification.message}
                    </p>
                    <p>รถไอดี: {notification.payload.carId}</p>
                    <p>เวลา: {formatDate(notification.payload.timestamp)}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        locale: th,
                      })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
