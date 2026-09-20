import { useState, useEffect } from "react";
import type { Route } from "~/types";
import { Loader2 } from "lucide-react";
import { Sheet, SheetContent } from "~/components/ui/sheet";

interface RoutePointModalProps {
  isOpen: boolean;
  route: Route | null;
  onClose: () => void;
}

export default function RoutePointModal(props: RoutePointModalProps) {
  const [MapComponent, setMapComponent] = useState<any>(null);

  useEffect(() => {
    if (props.isOpen && !MapComponent) {
      // Dynamically load the client-only map component that imports leaflet
      import("./RoutePointModalMap.client")
        .then((module) => {
          setMapComponent(() => module.default);
        })
        .catch((err) => {
          console.error("Failed to load map component", err);
        });
    }
  }, [props.isOpen, MapComponent]);

  if (!props.route) return null;

  if (!MapComponent) {
    return (
      <Sheet open={props.isOpen} onOpenChange={(open) => !open && props.onClose()}>
        <SheetContent className="w-full !max-w-[95vw] sm:!max-w-[95vw] xl:!max-w-[95vw] h-full flex flex-col items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground font-medium">กำลังโหลดแผนที่...</p>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return <MapComponent {...props} />;
}
