import { Bus, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { ResponseCarData } from "~/types";
import type { CarLocationUpdate } from "~/hook/useCarLocation.hook";

interface EtaCarCardProps {
  carId: string;
  cars: ResponseCarData[];
  currentLocation: CarLocationUpdate[] | null;
  role: "admin" | "user";
  onClose: () => void;
}

export default function EtaCarCard({
  carId,
  cars,
  currentLocation,
  role,
  onClose,
}: EtaCarCardProps) {
  const car = cars.find((c) => c.id === carId);
  const loc = currentLocation?.find((l) => l.carId === carId);
  const isActive = loc?.status === "active";

  return (
    <div className="rounded-md border border-border bg-background shadow-sm w-72">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border">
        <Bus size={14} className="text-muted-foreground shrink-0" />
        <span className="font-mono text-sm font-semibold flex-1">
          {car?.carNumber ?? carId}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onClose}
        >
          <X size={14} />
        </Button>
      </div>

      {/* Body */}
      <div className="px-3 py-2.5 space-y-2">
        {/* Status */}
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isActive ? "bg-green-500 animate-pulse" : "bg-muted-foreground/50"
            }`}
          />
          <span
            className={`text-xs font-mono font-semibold uppercase tracking-wider ${
              isActive ? "text-green-600" : "text-muted-foreground"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Admin only — driver placeholder */}
        {role === "admin" && (
          <div className="text-xs text-muted-foreground font-mono">คนขับ: —</div>
        )}

        {/* Separator */}
        <div className="h-px bg-border" />

        {/* ETA placeholder */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
          <span>⏱</span>
          <span>เวลาถึงป้าย (เร็วๆ นี้)</span>
        </div>

        {/* Coordinates */}
        {loc && (
          <div className="text-[10px] font-mono text-muted-foreground/70 tabular-nums">
            {loc.lat.toFixed(5)}, {loc.lng.toFixed(5)}
          </div>
        )}
      </div>
    </div>
  );
}
