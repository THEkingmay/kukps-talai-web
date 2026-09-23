import * as React from "react"
import { CalendarPlus, Edit2 } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet"
import { AssignmentDriverForm } from "./AssignmentDriverForm"
import type { AssignmentFormData } from "./AssignmentDriverForm"
import type { ComboboxOption } from "./ComboboxSelector"
import type { CarDriverShift } from "~/types"

interface AssignmentDriverSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: AssignmentFormData;
  driverOptions: ComboboxOption[];
  carOptions: ComboboxOption[];
  existingAssignments: CarDriverShift[];
  onSubmit: (data: AssignmentFormData) => void;
  isSubmitting: boolean;
}

export function AssignmentDriverSheet({
  open,
  onOpenChange,
  initialData,
  driverOptions,
  carOptions,
  existingAssignments,
  onSubmit,
  isSubmitting
}: AssignmentDriverSheetProps) {
  const isEditing = !!initialData?.id;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[480px] p-0 flex flex-col gap-0 border-l border-border shadow-xl bg-background">
        <div className="px-6 py-5 border-b border-border">
          <SheetHeader className="text-left space-y-1.5">
            <SheetTitle className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-foreground">
              {isEditing ? <Edit2 className="w-4 h-4 text-muted-foreground" /> : <CalendarPlus className="w-4 h-4 text-muted-foreground" />}
              {isEditing ? "แก้ไขการมอบหมายงาน" : "มอบหมายงานใหม่"}
            </SheetTitle>
            <SheetDescription className="text-sm text-muted-foreground">
              กำหนดคนขับรถและรถที่ใช้ พร้อมเลือกช่วงเวลาเริ่มและสิ้นสุด
            </SheetDescription>
          </SheetHeader>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <AssignmentDriverForm
            initialData={initialData}
            driverOptions={driverOptions}
            carOptions={carOptions}
            existingAssignments={existingAssignments}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
            isSubmitting={isSubmitting}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
