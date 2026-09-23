import * as React from "react"
import { Label } from "~/components/ui/label"
import { Button } from "~/components/ui/button"
import { Loader2, AlertCircle } from "lucide-react"
import { ComboboxSelector } from "./ComboboxSelector"
import type { ComboboxOption } from "./ComboboxSelector"
import { DateTimePicker } from "./DateTimePicker"
import type { CarDriverShift } from "~/types"

export interface AssignmentFormData {
  id?: string;
  driverId: string;
  carId: string;
  startTime: Date | undefined;
  endTime: Date | undefined;
}

interface AssignmentDriverFormProps {
  initialData?: AssignmentFormData;
  driverOptions: ComboboxOption[];
  carOptions: ComboboxOption[];
  existingAssignments: CarDriverShift[];
  onSubmit: (data: AssignmentFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function AssignmentDriverForm({
  initialData,
  driverOptions,
  carOptions,
  existingAssignments,
  onSubmit,
  onCancel,
  isSubmitting
}: AssignmentDriverFormProps) {
  const [formData, setFormData] = React.useState<AssignmentFormData>({
    id: initialData?.id,
    driverId: initialData?.driverId || "",
    carId: initialData?.carId || "",
    startTime: initialData?.startTime,
    endTime: initialData?.endTime,
  })

  const [conflictError, setConflictError] = React.useState<string | null>(null)

  // Validation: Check for overlaps
  React.useEffect(() => {
    if (!formData.driverId || !formData.carId || !formData.startTime || !formData.endTime) {
      setConflictError(null)
      return
    }

    if (formData.startTime >= formData.endTime) {
      setConflictError("End time must be after start time.")
      return
    }

    const start = new Date(formData.startTime).getTime()
    const end = new Date(formData.endTime).getTime()

    const hasConflict = existingAssignments.find(a => {
      // Skip self if editing
      if (formData.id && a.id === formData.id) return false;
      
      const aStart = new Date(a.startTime).getTime();
      const aEnd = new Date(a.endTime).getTime();
      
      // Check overlap
      const isOverlapping = start < aEnd && end > aStart;
      
      if (isOverlapping) {
        if (a.carId === formData.carId) return "รถคันนี้ถูกจองแล้วในช่วงเวลาดังกล่าว";
        if (a.driverId === formData.driverId) return "คนขับคนนี้มีงานแล้วในช่วงเวลาดังกล่าว";
      }
      return false;
    })

    if (hasConflict) {
      const conflictMsg = existingAssignments.find(a => {
        if (formData.id && a.id === formData.id) return false;
        const aStart = new Date(a.startTime).getTime();
        const aEnd = new Date(a.endTime).getTime();
        return start < aEnd && end > aStart && (a.carId === formData.carId || a.driverId === formData.driverId);
      });
      
      if (conflictMsg?.carId === formData.carId) {
        setConflictError("รถคันนี้ถูกจองแล้วในช่วงเวลาดังกล่าว");
      } else if (conflictMsg?.driverId === formData.driverId) {
        setConflictError("คนขับคนนี้มีงานแล้วในช่วงเวลาดังกล่าว");
      }
    } else {
      setConflictError(null)
    }
  }, [formData, existingAssignments])

  const isFormValid = formData.driverId && formData.carId && formData.startTime && formData.endTime && !conflictError

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isFormValid) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>คนขับ (Driver) <span className="text-destructive">*</span></Label>
          <ComboboxSelector
            options={driverOptions}
            value={formData.driverId}
            onValueChange={(val) => setFormData(p => ({ ...p, driverId: val }))}
            placeholder="เลือกคนขับ..."
            searchPlaceholder="ค้นหาชื่อคนขับ..."
            emptyText="ไม่พบคนขับ"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label>รถ (Car) <span className="text-destructive">*</span></Label>
          <ComboboxSelector
            options={carOptions}
            value={formData.carId}
            onValueChange={(val) => setFormData(p => ({ ...p, carId: val }))}
            placeholder="เลือกรถ..."
            searchPlaceholder="ค้นหาป้ายทะเบียน..."
            emptyText="ไม่พบรถ"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label>เริ่มงาน (Start Time) <span className="text-destructive">*</span></Label>
          <DateTimePicker
            value={formData.startTime}
            onChange={(val) => setFormData(p => ({ ...p, startTime: val }))}
            disabled={isSubmitting}
            placeholder="เลือกวัน-เวลาเริ่มงาน"
          />
        </div>

        <div className="space-y-2">
          <Label>สิ้นสุดงาน (End Time) <span className="text-destructive">*</span></Label>
          <DateTimePicker
            value={formData.endTime}
            onChange={(val) => setFormData(p => ({ ...p, endTime: val }))}
            disabled={isSubmitting}
            placeholder="เลือกวัน-เวลาสิ้นสุดงาน"
          />
        </div>

        {conflictError && (
          <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <p>{conflictError}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          ยกเลิก
        </Button>
        <Button type="submit" disabled={!isFormValid || isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData?.id ? "บันทึกการแก้ไข" : "สร้างงาน"}
        </Button>
      </div>
    </form>
  )
}
