import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { Check, Filter, Search, X } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { cn } from "cn";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface AssignmentFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  dateFilter: DateRange | undefined;
  onDateFilterChange: (value: DateRange | undefined) => void;
  driverFilter: string | undefined;
  onDriverFilterChange: (value: string | undefined) => void;
  driverOptions: { value: string; label: string }[];
  getDriverEmail: (id: string) => string;
  // Derived in the hook; only its truthiness decides whether the clear button
  // and the active-filter badges are rendered.
  hasAnyFilter: string | boolean | DateRange | undefined;
  onClearFilters: () => void;
}

export default function AssignmentFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  dateFilter,
  onDateFilterChange,
  driverFilter,
  onDriverFilterChange,
  driverOptions,
  getDriverEmail,
  hasAnyFilter,
  onClearFilters,
}: AssignmentFiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <div className="relative w-full sm:w-80">
          <Input
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ค้นหาชื่อคนขับ หรือป้ายทะเบียน..."
            className="pl-9 h-9"
          />
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5 pointer-events-none" />
        </div>

        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-full sm:w-[150px] h-9">
            <SelectValue placeholder="สถานะทั้งหมด" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">สถานะทั้งหมด (All)</SelectItem>
            <SelectItem value="active">กำลังทำงาน (Active)</SelectItem>
            <SelectItem value="upcoming">งานในอนาคต (Upcoming)</SelectItem>
            <SelectItem value="past">จบไปแล้ว (Past)</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 border-dashed">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              ตัวกรอง
              {(dateFilter || driverFilter) && (
                <>
                  <span className="mx-2 h-4 w-[1px] bg-border" />
                  <Badge
                    variant="secondary"
                    className="px-1 font-normal lg:hidden"
                  >
                    {(dateFilter ? 1 : 0) + (driverFilter ? 1 : 0)}
                  </Badge>
                  <div className="hidden space-x-1 lg:flex">
                    {driverFilter && (
                      <Badge
                        variant="secondary"
                        className="rounded-sm px-1 font-normal"
                      >
                        คนขับ
                      </Badge>
                    )}
                    {dateFilter && (
                      <Badge
                        variant="secondary"
                        className="rounded-sm px-1 font-normal"
                      >
                        วันที่
                      </Badge>
                    )}
                  </div>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[340px] p-0" align="start">
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium leading-none">คนขับ</h4>
                <Command className="border rounded-md">
                  <CommandInput placeholder="ค้นหาคนขับ..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>ไม่พบคนขับ</CommandEmpty>
                    <CommandGroup className="max-h-[140px] overflow-auto">
                      {driverOptions.map((driver) => (
                        <CommandItem
                          key={driver.value}
                          value={driver.label}
                          onSelect={() => {
                            onDriverFilterChange(
                              driverFilter === driver.value
                                ? undefined
                                : driver.value,
                            );
                          }}
                        >
                          <div
                            className={cn(
                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                              driverFilter === driver.value
                                ? "bg-primary border-primary text-primary-foreground"
                                : "border-primary opacity-50 [&_svg]:invisible",
                            )}
                          >
                            <Check className="h-4 w-4" />
                          </div>
                          {driver.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium leading-none">ช่วงเวลา</h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs flex-1"
                    onClick={() =>
                      onDateFilterChange({
                        from: startOfMonth(new Date()),
                        to: endOfMonth(new Date()),
                      })
                    }
                  >
                    เดือนนี้
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs flex-1"
                    onClick={() => {
                      const lastMonth = subMonths(new Date(), 1);
                      onDateFilterChange({
                        from: startOfMonth(lastMonth),
                        to: endOfMonth(lastMonth),
                      });
                    }}
                  >
                    เดือนที่แล้ว
                  </Button>
                </div>
                <div className="border rounded-md p-2 flex justify-center">
                  <Calendar
                    mode="range"
                    selected={dateFilter}
                    onSelect={onDateFilterChange}
                    numberOfMonths={1}
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {hasAnyFilter && (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-2 text-muted-foreground"
            onClick={onClearFilters}
          >
            ล้าง
          </Button>
        )}
      </div>

      {/* Active filters badges */}
      {(dateFilter || driverFilter) && (
        <div className="flex flex-wrap items-center gap-2">
          {driverFilter && (
            <Badge
              variant="secondary"
              className="h-7 px-2 rounded-md border-dashed font-normal"
            >
              <span className="text-muted-foreground mr-1">คนขับ:</span>{" "}
              {getDriverEmail(driverFilter)}
              <button
                className="ml-1 hover:bg-muted/50 rounded-full p-0.5"
                onClick={() => onDriverFilterChange(undefined)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {dateFilter?.from && (
            <Badge
              variant="secondary"
              className="h-7 px-2 rounded-md border-dashed font-normal"
            >
              <span className="text-muted-foreground mr-1">วันที่:</span>{" "}
              {format(dateFilter.from, "dd/MM/yyyy")}
              {dateFilter.to ? ` - ${format(dateFilter.to, "dd/MM/yyyy")}` : ""}
              <button
                className="ml-1 hover:bg-muted/50 rounded-full p-0.5"
                onClick={() => onDateFilterChange(undefined)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
