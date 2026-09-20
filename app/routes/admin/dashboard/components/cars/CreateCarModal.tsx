import type { Route as RouteType } from "~/types";
import { PlusCircle, Bus, Route as RouteIcon, Loader2 } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface CreateCarModalProps {
  isOpen: boolean;
  carNumber: string;
  routeId: string;
  routes: RouteType[];
  isSubmitting: boolean;
  onChangeCarNumber: (val: string) => void;
  onChangeRouteId: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function CreateCarModal({
  isOpen,
  carNumber,
  routeId,
  routes,
  isSubmitting,
  onChangeCarNumber,
  onChangeRouteId,
  onSubmit,
  onClose,
}: CreateCarModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>เพิ่มรถตะไลคันใหม่</DialogTitle>
              <DialogDescription>
                ลงทะเบียนรถตะไลเข้าสู่ระบบและกำหนดสายการเดินรถ
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="car-number" className="flex items-center gap-2">
              <Bus className="h-4 w-4 text-muted-foreground" />
              หมายเลข/ชื่อรถตะไล <span className="text-destructive">*</span>
            </Label>
            <Input
              id="car-number"
              required
              value={carNumber}
              onChange={(e) => onChangeCarNumber(e.target.value)}
              placeholder="เช่น: รถตะไล 1, ตะไลสาย ก"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="route-id" className="flex items-center gap-2">
              <RouteIcon className="h-4 w-4 text-muted-foreground" />
              สายการเดินรถ (Route) <span className="text-destructive">*</span>
            </Label>
            <Select
              required
              value={routeId}
              onValueChange={onChangeRouteId}
              disabled={isSubmitting}
            >
              <SelectTrigger id="route-id">
                <SelectValue placeholder="-- กรุณาเลือกสายการเดินรถ --" />
              </SelectTrigger>
              <SelectContent>
                {routes.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !carNumber.trim() || !routeId}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "กำลังบันทึก..." : "ยืนยันเพิ่มรถตะไล"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
