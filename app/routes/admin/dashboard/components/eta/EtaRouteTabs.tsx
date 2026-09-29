import type { Route } from "~/types";

interface EtaRouteTabsProps {
  routes: Route[];
  selectedRouteId: string | null;
  onSelect: (routeId: string) => void;
}

export default function EtaRouteTabs({
  routes,
  selectedRouteId,
  onSelect,
}: EtaRouteTabsProps) {
  return (
    <div className="flex gap-1.5 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden px-4 py-2">
      {routes.map((route) => (
        <button
          key={route.id}
          onClick={() => onSelect(route.id)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
            selectedRouteId === route.id
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          }`}
        >
          {route.name}
        </button>
      ))}
    </div>
  );
}
