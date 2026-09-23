import * as React from "react"
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
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[450px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{initialData?.id ? "แก้ไขการมอบหมายงาน" : "มอบหมายงานใหม่ (Assign Driver)"}</SheetTitle>
          <SheetDescription>
            กำหนดคนขับรถและรถที่ใช้ พร้อมเลือกช่วงเวลาเริ่มและสิ้นสุด
          </SheetDescription>
        </SheetHeader>
        <AssignmentDriverForm
          initialData={initialData}
          driverOptions={driverOptions}
          carOptions={carOptions}
          existingAssignments={existingAssignments}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </SheetContent>
    </Sheet>
  )
}
