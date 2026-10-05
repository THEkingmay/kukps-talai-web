import { useEffect, useState } from "react";
import { Plus, Search, RefreshCw, Filter, X, Check } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useDialog } from "~/components/providers/DialogProvider";
import {
  getAll,
  create,
  update,
  deleteById,
} from "~/actions/assignment-driver.action";
import { getAll as getAllUsers } from "~/actions/user.action";
import { getCars } from "~/actions/car.action";
import type { CarDriverShift, User, ResponseCarData } from "~/types";
import { AssignmentDriverTable } from "./assignment-driver/AssignmentDriverTable";
import { AssignmentDriverSheet } from "./assignment-driver/AssignmentDriverSheet";
import type { AssignmentFormData } from "./assignment-driver/AssignmentDriverForm";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Badge } from "~/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { Calendar } from "~/components/ui/calendar";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { cn } from "cn";

export default function AssignmentDriverComponent() {
  const { alert } = useDialog();
  const [shifts, setShifts] = useState<CarDriverShift[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [cars, setCars] = useState<ResponseCarData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>();
  const [driverFilter, setDriverFilter] = useState<string | undefined>();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingData, setEditingData] = useState<
    AssignmentFormData | undefined
  >();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [shiftsRes, usersRes, carsRes] = await Promise.all([
        getAll(),
        getAllUsers(),
        getCars(),
      ]);

      if (shiftsRes.success) setShifts(shiftsRes.data.data);
      if (usersRes.success) setUsers(usersRes.data.data);
      if (carsRes.success) setCars(carsRes.data.data);
    } catch (error) {
      alert({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลได้",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditingData(undefined);
    setIsSheetOpen(true);
  };

  const handleOpenEdit = (shift: CarDriverShift) => {
    setEditingData({
      id: shift.id,
      driverId: shift.driverId,
      carId: shift.carId,
      startTime: new Date(shift.startTime),
      endTime: new Date(shift.endTime),
    });
    setIsSheetOpen(true);
  };

  const handleSubmit = async (data: AssignmentFormData) => {
    if (!data.startTime || !data.endTime) return;

    setIsSubmitting(true);
    const payload = {
      carId: data.carId,
      driverId: data.driverId,
      startTime: data.startTime,
      endTime: data.endTime,
    };
    let result;
    if (data.id) {
      result = await update(data.id, { id: data.id, ...payload });
    } else {
      result = await create(payload);
    }

    setIsSubmitting(false);

    if (result.success) {
      setIsSheetOpen(false);
      fetchData();
      alert({
        title: "สำเร็จ",
        description: data.id ? "แก้ไขข้อมูลสำเร็จ" : "สร้างการมอบหมายงานสำเร็จ",
      });
    } else {
      alert({
        title: "เกิดข้อผิดพลาด",
        description: result.error || "ไม่สามารถบันทึกข้อมูลได้",
      });
    }
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    const result = await deleteById(id);
    if (result.success) {
      setShifts((prev) => prev.filter((s) => s.id !== id));
      alert({
        title: "สำเร็จ",
        description: "ลบข้อมูลสำเร็จ",
      });
    } else {
      alert({
        title: "เกิดข้อผิดพลาด",
        description: result.error || "ไม่สามารถลบข้อมูลได้",
      });
    }
    setIsLoading(false);
  };

  // Map related data
  const extendedShifts = shifts.map((shift) => ({
    ...shift,
    driverObj: users.find((u) => u.id === shift.driverId),
    carObj: cars.find((c) => c.id === shift.carId),
  }));

  // Options for form
  const driverOptions = users
    .filter((u) => u.role === "driver")
    .map((u) => ({ value: u.id, label: u.email }));

  const carOptions = cars
    .filter((cx) => cx.deletedAt === null)
    .map((c) => ({ value: c.id, label: c.carNumber }));

  // Filter shifts
  const filteredShifts = extendedShifts.filter((shift) => {
    const matchesSearch =
      shift.driverObj?.email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      shift.carObj?.carNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (driverFilter && shift.driverId !== driverFilter) return false;

    const now = new Date().getTime();
    const start = new Date(shift.startTime).getTime();
    const end = new Date(shift.endTime).getTime();

    if (statusFilter === "active" && !(start <= now && end >= now))
      return false;
    if (statusFilter === "upcoming" && !(start > now)) return false;
    if (statusFilter === "past" && !(end < now)) return false;

    // Date range filter
    if (dateFilter?.from) {
      const filterStart = dateFilter.from.getTime();
      const filterEnd = (dateFilter.to || dateFilter.from).getTime() + 86399999;
      if (start > filterEnd || end < filterStart) return false;
    }

    return true;
  });

  const getDriverEmail = (id: string) =>
    users.find((u) => u.id === id)?.email || id;

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter(undefined);
    setDriverFilter(undefined);
  };

  const hasAnyFilter =
    searchTerm || statusFilter !== "all" || dateFilter || driverFilter;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">มอบหมายงานคนขับ</h2>
          <p className="text-muted-foreground text-sm">
            จัดการตารางงานและผูกรถให้กับคนขับแต่ละช่วงเวลา
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchData} disabled={isLoading}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            รีเฟรช
          </Button>
          <Button onClick={handleOpenCreate}>
            <Plus className="mr-2 h-4 w-4" />
            เพิ่มตารางงาน
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative w-full sm:w-80">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อคนขับ หรือป้ายทะเบียน..."
              className="pl-9 h-9"
            />
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5 pointer-events-none" />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                              setDriverFilter(
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
                        setDateFilter({
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
                        setDateFilter({
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
                      onSelect={setDateFilter}
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
              onClick={clearFilters}
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
                  onClick={() => setDriverFilter(undefined)}
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
                {dateFilter.to
                  ? ` - ${format(dateFilter.to, "dd/MM/yyyy")}`
                  : ""}
                <button
                  className="ml-1 hover:bg-muted/50 rounded-full p-0.5"
                  onClick={() => setDateFilter(undefined)}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      <AssignmentDriverTable
        assignments={filteredShifts}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      <AssignmentDriverSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        initialData={editingData}
        driverOptions={driverOptions}
        carOptions={carOptions}
        existingAssignments={shifts}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
