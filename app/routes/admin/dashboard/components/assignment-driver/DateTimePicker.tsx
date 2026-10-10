import * as React from "react"
import { format, startOfToday } from "date-fns"
import { th } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Calendar } from "~/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { Input } from "~/components/ui/input"

interface DateTimePickerProps {
  value?: Date
  onChange: (date: Date | undefined) => void
  disabled?: boolean
  /** ปิดไม่ให้เลือกวัน/เวลาที่ย้อนหลัง (ก่อนเวลาปัจจุบัน) */
  disablePast?: boolean
  placeholder?: string
}

export function DateTimePicker({ value, onChange, disabled, disablePast, placeholder = "เลือกวันและเวลา" }: DateTimePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value)
  const [time, setTime] = React.useState<string>(value ? format(value, "HH:mm") : "")

  React.useEffect(() => {
    if (value) {
      setDate(value)
      setTime(format(value, "HH:mm"))
    } else {
      setDate(undefined)
      setTime("")
    }
  }, [value])

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate)
    updateDateTime(newDate, time)
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value
    setTime(newTime)
    updateDateTime(date, newTime)
  }

  const updateDateTime = (d: Date | undefined, t: string) => {
    if (!d) {
      onChange(undefined)
      return
    }
    
    const [hours, minutes] = t.split(":").map(Number)
    const updatedDate = new Date(d)
    if (!isNaN(hours) && !isNaN(minutes)) {
      updatedDate.setHours(hours)
      updatedDate.setMinutes(minutes)
    }
    onChange(updatedDate)
  }

  const formatThaiDate = (dateVal: Date) => {
    const dayMonth = format(dateVal, "dd MMM", { locale: th })
    const year = dateVal.getFullYear() + 543
    const timeVal = format(dateVal, "HH:mm")
    return `${dayMonth} ${year}, ${timeVal}`
  }

  const now = new Date()
  const isSelectedToday = date
    ? date.toDateString() === now.toDateString()
    : false
  const minTime = isSelectedToday ? format(now, "HH:mm") : "00:00"

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? formatThaiDate(value) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          locale={th}
          disabled={disablePast ? { before: startOfToday() } : undefined}
        />
        <div className="p-3 border-t border-border flex items-center justify-between gap-2">
          <span className="text-sm font-medium">เวลา</span>
          <Input 
            type="time" 
            value={time}
            onChange={handleTimeChange}
            min={disablePast ? minTime : undefined}
            className="w-[120px]" 
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
