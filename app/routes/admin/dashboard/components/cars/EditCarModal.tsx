import type { ResponseCarData, Route as RouteType } from "~/types";
import { Pencil, Bus, Route as RouteIcon, Lock, CheckCircle2, XCircle, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";

interface EditCarModalProps {
  car: ResponseCarData | null;
  carNumber: string;
  routeId: string;
  routes: RouteType[];
  isSubmitting: boolean;
  onChangeCarNumber: (val: string) => void;
  onChangeRouteId: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function EditCarModal({
  car,
  carNumber,
  routeId,
  routes,
  isSubmitting,
  onChangeCarNumber,
  onChangeRouteId,
  onSubmit,
  onClose,
}: EditCarModalProps) {
  if (!car) return null;

  return (
    <Dialog open={!!car} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Pencil className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>แก้ไขข้อมูลรถตะไล</DialogTitle>
              <DialogDescription className="font-mono text-xs">
                ID: {car.id}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6 pt-2">
          {/* Readonly Status Info Banner */}
          <div className="flex items-center justify-between rounded-md border bg-muted/50 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-background text-muted-foreground shadow-sm">
                <Lock className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">สถานะ (Server Managed)</span>
                <span className="text-xs text-muted-foreground">ควบคุมอัตโนมัติ</span>
              </div>
            </div>

            {car.status === "active" ? (
              <Badge variant="outline" className="gap-1 border-green-200 bg-green-50 text-green-700">
                <CheckCircle2 className="h-3 w-3 animate-pulse" />
                พร้อมใช้งาน
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1 text-muted-foreground">
                <XCircle className="h-3 w-3" />
                ปิดใช้งาน
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-car-number" className="flex items-center gap-2">
              <Bus className="h-4 w-4 text-muted-foreground" />
              หมายเลข/ชื่อรถตะไล
            </Label>
            <Input
              id="edit-car-number"
              type="text"
              required
              value={carNumber}
              onChange={(e) => onChangeCarNumber(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-route-id" className="flex items-center gap-2">
              <RouteIcon className="h-4 w-4 text-muted-foreground" />
              สายการเดินรถ (Route)
            </Label>
            <Select required value={routeId} onValueChange={onChangeRouteId} disabled={isSubmitting}>
              <SelectTrigger id="edit-route-id">
                <SelectValue placeholder="-- กรุณาเลือกสายการเดินรถ --" />
              </SelectTrigger>
              <SelectContent>
                {routes.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name} ({r.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              ยกเลิก
            </Button>
            <Button type="submit" disabled={isSubmitting || !carNumber.trim() || !routeId}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
