import { useState } from "react";
import { MapPin, ChevronUp } from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import EtaRouteTabs from "./EtaRouteTabs";
import type { Route, ResponseCarData } from "~/types";
import type { WebsocketMessageTypeLocation } from "~/components/providers/WebsocketProvider";

interface EtaSidebarProps {
  role: "admin" | "user";
  routes: Route[];
  cars: ResponseCarData[];
  currentLocation: Omit<WebsocketMessageTypeLocation, "type">[] | null;
  selectedRouteId: string | null;
  selectedCarId: string | null;
  onRouteSelect: (routeId: string) => void;
  onCarSelect: (carId: string | null) => void;
  isConnected: boolean;
  className?: string;
  variant: "sidebar" | "sheet";
}

export default function EtaSidebar({
  role,
  routes,
  cars,
  currentLocation,
  selectedRouteId,
  selectedCarId,
  onRouteSelect,
  onCarSelect,
  isConnected,
  className,
  variant,
}: EtaSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Filtering and sorting logic — only active cars shown for both roles
  const carsInRoute = cars.filter((c) => c.routeId === selectedRouteId);
  const filteredCars = carsInRoute.filter((car) => {
    const loc = currentLocation?.find((l) => l.carId === car.id);
    return loc?.status === "active"; // only active for both roles
  });
  const sortedCars = [...filteredCars];

  // Shared car list content
  const carListContent = (
    <>
      {currentLocation === null ? (
        <div className="space-y-0">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 border-b border-border/50"
            >
              <Skeleton className="w-2 h-2 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-3 w-14" />
              </div>
              <Skeleton className="h-4 w-12 rounded" />
            </div>
          ))}
        </div>
      ) : sortedCars.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-32 text-center px-4">
          <span className="text-sm text-muted-foreground">
            ไม่มีรถที่ active ในสายนี้
          </span>
        </div>
      ) : (
        sortedCars.map((car) => {
          const isSelected = selectedCarId === car.id;
          return (
            <button
              key={car.id}
              onClick={() => onCarSelect(isSelected ? null : car.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 border-b border-border/50 transition-colors text-left ${
                isSelected ? "bg-muted" : "hover:bg-muted/40"
              }`}
            >
              <span className="w-2 h-2 rounded-full shrink-0 bg-green-500 animate-pulse" />
              <div className="flex-1 min-w-0">
                <p className="font-mono text-sm font-medium truncate">
                  {car.carNumber}
                </p>
              </div>
            </button>
          );
        })
      )}
    </>
  );

  if (variant === "sidebar") {
    return (
      <div className={cn("flex flex-col h-full", className)}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold">
              {role === "admin" ? "ETA Monitor" : "ติดตามรถ"}
            </span>
          </div>
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              isConnected ? "bg-green-500 animate-pulse" : "bg-red-400"
            }`}
          />
        </div>

        {/* Route tabs */}
        <div className="border-b border-border shrink-0">
          <EtaRouteTabs
            routes={routes}
            selectedRouteId={selectedRouteId}
            onSelect={onRouteSelect}
          />
        </div>

        {/* Car list */}
        <div className="flex-1 overflow-y-auto">{carListContent}</div>
      </div>
    );
  }

  // variant === "sheet" — mobile bottom sheet
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-[1000] border-t border-border bg-background/95 backdrop-blur-sm",
        "transition-all duration-300 ease-in-out",
        "rounded-t-xl",
        className,
      )}
    >
      {/* Drag handle */}
      <div
        className="flex justify-center pt-2 pb-1 cursor-pointer"
        onClick={() => setIsExpanded((e) => !e)}
      >
        <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
      </div>

      {/* Collapsed header (always visible) */}
      <div
        className="flex items-center justify-between px-4 py-2.5 cursor-pointer"
        onClick={() => setIsExpanded((e) => !e)}
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            {routes.find((r) => r.id === selectedRouteId)?.name ?? "เลือกสาย"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">
            {sortedCars.length} คัน
          </span>
          <ChevronUp
            className={`w-4 h-4 text-muted-foreground transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="max-h-[55vh] overflow-hidden flex flex-col">
          <div className="border-t border-border shrink-0">
            <EtaRouteTabs
              routes={routes}
              selectedRouteId={selectedRouteId}
              onSelect={onRouteSelect}
            />
          </div>
          <div className="overflow-y-auto flex-1">{carListContent}</div>
        </div>
      )}
    </div>
  );
}
