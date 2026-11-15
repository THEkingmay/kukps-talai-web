import type { Route } from "~/types";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { useRoutePointEditor } from "~/routes/admin/dashboard/hooks/useRoutePointEditor";
import RoutePointMapCanvas from "./route-point/RoutePointMapCanvas";
import RoutePointSidebar from "./route-point/RoutePointSidebar";
import { Crosshair, MapPin, X } from "lucide-react";

interface RoutePointModalProps {
  isOpen: boolean;
  route: Route | null;
  onClose: () => void;
}

/**
 * Full-screen sheet for editing the stops of one route.
 *
 * The Leaflet canvas is client-only; this file is loaded on demand by
 * `RoutePoint.component.tsx` so `window`-dependent code stays off the SSR path.
 */
export default function RoutePointModal({
  isOpen,
  route,
  onClose,
}: RoutePointModalProps) {
  const editor = useRoutePointEditor({ isOpen, route });

  if (!isOpen || !route) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        className="flex h-full w-full flex-col border-border bg-background p-0 !max-w-[95vw] sm:!max-w-[95vw] xl:!max-w-[95vw]"
        showCloseButton={false}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-background p-5 sm:p-6">
          <SheetHeader className="flex flex-row items-center gap-4 space-y-0 text-left">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <SheetTitle className="text-xl font-bold leading-tight tracking-tight text-foreground">
                จัดการเส้นทาง: {route.name}
              </SheetTitle>
              <SheetDescription className="mt-0.5 font-mono text-sm">
                Route ID: {route.id}
              </SheetDescription>
            </div>
          </SheetHeader>
        </div>

        {/* Content body */}
        <div className="col-span-3 flex flex-1 flex-col overflow-hidden lg:flex-row">
          {/* Left: map */}
          <div className="relative col-span-1 min-h-[300px] flex-1 border-b border-border bg-muted/50 lg:min-h-0 lg:border-b-0 lg:border-r">
            {editor.mode === "insert" && (
              <div className="absolute left-1/2 top-4 z-[1000] flex animate-pulse items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg">
                <Crosshair className="h-4 w-4" />
                คลิกบนแผนที่เพื่อแทรกจุดจอด
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    editor.cancelInsert();
                  }}
                  className="ml-2 text-primary-foreground/70 hover:text-primary-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            <RoutePointMapCanvas
              groupedPoints={editor.groupedPoints}
              groupedPendingPoints={editor.groupedPendingPoints}
              mapPoints={editor.mapPoints}
              hasExistingPoints={editor.hasExistingPoints}
              mode={editor.mode}
              isLoading={editor.isLoading}
              onMapClick={editor.handleMapClick}
            />
          </div>

          {/* Right: stop list */}
          <RoutePointSidebar
            points={editor.points}
            pendingPoints={editor.pendingPoints}
            editState={editor.editState}
            isLoading={editor.isLoading}
            isSaving={editor.isSaving}
            updatingId={editor.updatingId}
            deletingId={editor.deletingId}
            mode={editor.mode}
            summaryLabel={editor.summaryLabel}
            hasChanges={editor.hasChanges}
            isStopPoint={editor.isStopPoint}
            onEditField={editor.updateEditField}
            onSavePoint={editor.saveExistingPoint}
            onDeletePoint={editor.requestDeletePoint}
            onStartInsert={editor.startInsert}
            onPendingField={editor.updatePendingField}
            onRemovePending={editor.removePendingPoint}
            onSaveInitialPoints={editor.saveInitialPoints}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
