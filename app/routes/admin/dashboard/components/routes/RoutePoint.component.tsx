import { useState, useEffect } from "react";
import type { Route } from "~/types";
import { Loader2 } from "lucide-react";

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

  if (!props.isOpen || !props.route) return null;

  if (!MapComponent) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-xs bg-gray-900/40 animate-fade-in">
        <div className="bg-white border border-gray-200 rounded-lg shadow-2xl p-10 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
          <p className="text-gray-500 font-medium">กำลังโหลดแผนที่...</p>
        </div>
      </div>
    );
  }

  return <MapComponent {...props} />;
}
