import type { Route as RouteType } from "~/types";
import { Pencil, Route as RouteIcon, Loader2 } from "lucide-react";

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

interface EditRouteModalProps {
  route: RouteType | null;
  editName: string;
  isSubmitting: boolean;
  onChangeName: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function EditRouteModal({
  route,
  editName,
  isSubmitting,
  onChangeName,
  onSubmit,
  onClose,
}: EditRouteModalProps) {
  if (!route) return null;

  return (
    <Dialog open={!!route} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Pencil className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>แก้ไขเส้นทางเดินรถ</DialogTitle>
              <DialogDescription className="font-mono text-xs">
                ID: {route.id}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-route-name" className="flex items-center gap-2">
              <RouteIcon className="h-4 w-4 text-muted-foreground" />
              ชื่อสายการเดินรถ
            </Label>
            <Input
              id="edit-route-name"
              type="text"
              required
              value={editName}
              onChange={(e) => onChangeName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <DialogFooter className="border-t pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              ยกเลิก
            </Button>
            <Button type="submit" disabled={isSubmitting || !editName.trim()}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
