import { Link } from "react-router";
import type { ResponseCarData } from "~/types";
import { Button } from "~/components/ui/button";
import { CarStatusBadge } from "~/routes/admin/dashboard/components/cars/CarTable";
import { Loader2 } from "lucide-react";

interface CarDetailHeaderProps {
  car: ResponseCarData;
  isDeleted: boolean;
  actionPending: boolean;
  onOpenCredentials: () => void;
  onOpenEdit: () => void;
  onDelete: () => void;
}

/** Title row + primary actions of the car detail page. */
export default function CarDetailHeader({
  car,
  isDeleted,
  actionPending,
  onOpenCredentials,
  onOpenEdit,
  onDelete,
}: CarDetailHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 items-center gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-xl font-bold tracking-tight md:text-2xl">
              รถตะไลหมายเลข {car.carNumber}
            </h1>
            <CarStatusBadge status={car.status} isDeleted={isDeleted} />
          </div>
          <p className="truncate font-mono text-xs text-muted-foreground">
            System ID: {car.id}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenCredentials}
          className="h-8"
        >
          MQTT Credentials
        </Button>
        <Button variant="outline" size="sm" onClick={onOpenEdit} className="h-8">
          แก้ไขข้อมูล
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
              "ลบรถ"
            )}
          </Button>
        ) : null}
        <Button variant="ghost" size="sm" asChild className="h-8">
          <Link to="/admin/cars">← กลับรายการ</Link>
        </Button>
      </div>
    </div>
  );
}
