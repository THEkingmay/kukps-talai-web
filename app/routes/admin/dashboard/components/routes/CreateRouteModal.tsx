import { Plus, Route as RouteIcon, Loader2 } from "lucide-react";

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

interface CreateRouteModalProps {
  isOpen: boolean;
  routeName: string;
  isSubmitting: boolean;
  onChangeName: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function CreateRouteModal({
  isOpen,
  routeName,
  isSubmitting,
  onChangeName,
  onSubmit,
  onClose,
}: CreateRouteModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>เพิ่มเส้นทางเดินรถใหม่ (Add Route)</DialogTitle>
              <DialogDescription>
                ระบุชื่อสายเดินรถให้ชัดเจน
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="route-name" className="flex items-center gap-2">
              <RouteIcon className="h-4 w-4 text-muted-foreground" />
              ชื่อสายการเดินรถ <span className="text-destructive">*</span>
            </Label>
            <Input
              id="route-name"
              type="text"
              required
              value={routeName}
              onChange={(e) => onChangeName(e.target.value)}
              placeholder="ระบุชื่อสายการเดินรถ..."
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              ครอบคลุมจุดเริ่มต้นและสถานที่สำคัญในมหาวิทยาลัย
            </p>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              ยกเลิก
            </Button>
            <Button type="submit" disabled={isSubmitting || !routeName.trim()}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "กำลังบันทึก..." : "ยืนยันเพิ่มเส้นทาง"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
