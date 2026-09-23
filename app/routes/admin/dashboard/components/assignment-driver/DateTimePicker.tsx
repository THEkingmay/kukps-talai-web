import * as React from "react"
import { format } from "date-fns"
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
  placeholder?: string
}

export function DateTimePicker({ value, onChange, disabled, placeholder = "Pick a date and time" }: DateTimePickerProps) {
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
          {value ? format(value, "PPp") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
        />
        <div className="p-3 border-t border-border flex items-center justify-between gap-2">
          <span className="text-sm font-medium">Time</span>
          <Input 
            type="time" 
            value={time}
            onChange={handleTimeChange}
            className="w-[120px]" 
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
