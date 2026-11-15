import type { RoutePoint } from "~/types";
import type {
  PendingRoutePoint,
  RoutePointEditState,
  RoutePointEditValues,
  RoutePointEditorMode,
} from "~/routes/admin/dashboard/hooks/useRoutePointEditor";
import { Loader2, MapPin, Plus, Save, Route as RouteIcon, Trash2 } from "lucide-react";

interface RoutePointSidebarProps {
  points: RoutePoint[];
  pendingPoints: PendingRoutePoint[];
  editState: RoutePointEditState;
  isLoading: boolean;
  isSaving: boolean;
  updatingId: string | null;
  deletingId: string | null;
  mode: RoutePointEditorMode;
  summaryLabel: string;
  hasChanges: (pointId: string) => boolean;
  isStopPoint: (pointId: string) => boolean;
  onEditField: (
    pointId: string,
    field: keyof RoutePointEditValues,
    value: string,
  ) => void;
  onSavePoint: (pointId: string) => void;
  onDeletePoint: (pointId: string) => void;
  onStartInsert: (afterSequence: number, beforeSequence: number | null) => void;
  onPendingField: (
    index: number,
    field: "name" | "timeToNextSecs",
    value: string,
  ) => void;
  onRemovePending: (index: number) => void;
  onSaveInitialPoints: () => void;
}

/** Right panel of the route point editor: the editable stop list. */
export default function RoutePointSidebar({
  points,
  pendingPoints,
  editState,
  isLoading,
  isSaving,
  updatingId,
  deletingId,
  mode,
  summaryLabel,
  hasChanges,
  isStopPoint,
  onEditField,
  onSavePoint,
  onDeletePoint,
  onStartInsert,
  onPendingField,
  onRemovePending,
  onSaveInitialPoints,
}: RoutePointSidebarProps) {
  return (
    <div className="flex w-full shrink-0 flex-col bg-background lg:w-[400px] xl:w-[450px]">
      <div className="flex shrink-0 items-center justify-between border-b border-border bg-background/50 p-4">
        <span className="flex items-center gap-1.5 text-sm font-bold text-foreground">
          <RouteIcon className="h-4 w-4 text-primary" /> รายการจุดจอด
        </span>
        <span className="rounded-md border border-border bg-muted px-2.5 py-1 font-mono text-xs font-medium text-muted-foreground">
          {summaryLabel}
        </span>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {isLoading ? (
          <div className="py-12 text-center font-mono text-muted-foreground">
            <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-muted-foreground" />
            กำลังโหลดข้อมูล...
          </div>
        ) : points.length === 0 && pendingPoints.length === 0 ? (
          <div className="rounded-md border-2 border-dashed border-border bg-background/30 py-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MapPin className="h-6 w-6" />
            </div>
            <h4 className="mb-1 text-sm font-bold text-foreground">
              ยังไม่มีจุดจอดในเส้นทางนี้
            </h4>
            <p className="px-4 text-xs text-muted-foreground">
              คลิกบนแผนที่เพื่อเริ่มสร้างเส้นทาง จุดแรกจะถูกสร้างทันที
            </p>
          </div>
        ) : (
          <div className="space-y-2 pb-10">
            {/* Persisted points */}
            {points.map((point, index) => {
              const isStop = isStopPoint(point.id);
              return (
                <div key={point.id}>
                  <div
                    className={`rounded-md border p-3 transition-all ${
                      updatingId === point.id
                        ? "border-primary/30 bg-primary/10"
                        : isStop
                          ? "border-primary/20 bg-background shadow-sm hover:border-primary/40"
                          : "border-border bg-background opacity-80 shadow-2xs hover:border-muted-foreground/30 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-bold ${
                          isStop
                            ? "border-primary bg-primary text-primary-foreground shadow-sm"
                            : "border-border bg-background text-muted-foreground"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1 space-y-2.5">
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          <div>
                            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                              ชื่อจุด / ป้าย
                            </label>
                            <input
                              type="text"
                              value={editState[point.id]?.name || ""}
                              onChange={(e) =>
                                onEditField(point.id, "name", e.target.value)
                              }
                              placeholder="เช่น หน้า มก."
                              className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm text-foreground placeholder-gray-400 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                              เวลาไปจุดถัดไป (วิ)
                            </label>
                            <input
                              type="number"
                              value={editState[point.id]?.timeToNextSecs || ""}
                              onChange={(e) =>
                                onEditField(
                                  point.id,
                                  "timeToNextSecs",
                                  e.target.value,
                                )
                              }
                              placeholder="เช่น 120"
                              className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 font-mono text-sm text-foreground placeholder-gray-400 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="font-mono text-[10px] text-muted-foreground">
                            SEQ: {point.sequence}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {hasChanges(point.id) && (
                              <button
                                onClick={() => onSavePoint(point.id)}
                                disabled={updatingId === point.id}
                                className="flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90 disabled:opacity-50"
                              >
                                {updatingId === point.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Save className="h-3 w-3" />
                                )}
                                บันทึก
                              </button>
                            )}
                            <button
                              onClick={() => onDeletePoint(point.id)}
                              disabled={deletingId === point.id}
                              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                              title="ลบจุดนี้"
                            >
                              {deletingId === point.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Insert divider between two points */}
                  {index < points.length - 1 && (
                    <div className="group relative my-1 flex justify-center">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-dashed border-border transition-colors group-hover:border-primary/30" />
                      </div>
                      <button
                        onClick={() =>
                          onStartInsert(
                            point.sequence,
                            points[index + 1].sequence,
                          )
                        }
                        className="relative flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-semibold text-muted-foreground opacity-0 shadow-2xs transition-all hover:text-primary group-hover:border-primary/40 group-hover:text-primary group-hover:opacity-100 focus:opacity-100"
                      >
                        <Plus className="h-3 w-3" /> แทรกจุด
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Append to the end (only when points exist) */}
            {points.length > 0 && mode === "view" && (
              <div className="pt-2">
                <button
                  onClick={() =>
                    onStartInsert(points[points.length - 1].sequence, null)
                  }
                  className="flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-muted-foreground/30 bg-background py-2.5 text-xs font-semibold text-muted-foreground transition-all hover:border-muted-foreground/50 hover:bg-background hover:text-foreground"
                >
                  <Plus className="h-4 w-4" /> เพิ่มจุดต่อท้าย
                </button>
              </div>
            )}

            {/* Staged points, before the first save */}
            {pendingPoints.length > 0 && (
              <div className="space-y-3">
                {pendingPoints.map((point, index) => (
                  <div
                    key={index}
                    className="rounded-md border border-amber-200 bg-amber-50/50 p-3 shadow-2xs"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-amber-200 bg-amber-100 font-mono text-xs font-bold text-amber-700">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1 space-y-2.5">
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          <div>
                            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                              ชื่อจุด
                            </label>
                            <input
                              type="text"
                              value={point.name}
                              onChange={(e) =>
                                onPendingField(index, "name", e.target.value)
                              }
                              placeholder="ยังไม่มีชื่อ"
                              className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm text-foreground placeholder-gray-400 transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                              เวลาถึงจุดถัดไป(วิ)
                            </label>
                            <input
                              type="number"
                              value={point.timeToNextSecs}
                              onChange={(e) =>
                                onPendingField(
                                  index,
                                  "timeToNextSecs",
                                  e.target.value,
                                )
                              }
                              placeholder="เช่น 120"
                              className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 font-mono text-sm text-foreground placeholder-gray-400 transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-amber-600/70">
                            SEQ: {point.sequence}
                          </span>
                          <button
                            onClick={() => onRemovePending(index)}
                            className="text-[10px] font-semibold text-foreground hover:underline"
                          >
                            ลบจุดนี้
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Save the staged route */}
      {points.length === 0 && pendingPoints.length > 0 && (
        <div className="shrink-0 border-t border-border bg-background p-4">
          <button
            onClick={onSaveInitialPoints}
            disabled={isSaving}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            บันทึกเส้นทาง ({pendingPoints.length} จุด)
          </button>
        </div>
      )}
    </div>
  );
}
