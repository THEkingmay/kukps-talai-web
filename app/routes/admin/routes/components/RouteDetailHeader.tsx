import { Link } from "react-router";
import type { Route as RouteType } from "~/types";
import { Button } from "~/components/ui/button";
import { Loader2 } from "lucide-react";

interface RouteDetailHeaderProps {
  route: RouteType;
  isDeleted: boolean;
  actionPending: boolean;
  onOpenPoints: () => void;
  onOpenEdit: () => void;
  onDelete: () => void;
}

/** Title row + primary actions of the route detail page. */
export default function RouteDetailHeader({
  route,
  isDeleted,
  actionPending,
  onOpenPoints,
  onOpenEdit,
  onDelete,
}: RouteDetailHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="min-w-0">
        <h1 className="truncate text-xl font-bold tracking-tight md:text-2xl">
          สายการเดินรถ: {route.name}
        </h1>
        <p className="truncate font-mono text-xs text-muted-foreground">
          Route ID: {route.id}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenPoints}
          className="h-8"
        >
          จัดการจุดจอด
        </Button>
        <Button variant="outline" size="sm" onClick={onOpenEdit} className="h-8">
          แก้ไขชื่อ
        </Button>
        {!isDeleted ? (
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            disabled={actionPending}
            className="h-8"
          >
            {actionPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "ลบสายรถ"
            )}
          </Button>
        ) : null}
        <Button variant="ghost" size="sm" asChild className="h-8">
          <Link to="/admin/routes">← กลับรายการ</Link>
        </Button>
      </div>
    </div>
  );
}
