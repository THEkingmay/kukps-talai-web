import { useEffect, useState } from "react";
import { Plus, Search, RefreshCw } from "lucide-react";
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

export default function AssignmentDriverComponent() {
  const { alert } = useDialog();
  const [shifts, setShifts] = useState<CarDriverShift[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [cars, setCars] = useState<ResponseCarData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
  const carOptions = cars.map((c) => ({ value: c.id, label: c.carNumber }));

  // Filter shifts
  const filteredShifts = extendedShifts.filter((shift) => {
    const matchesSearch =
      shift.driverObj?.email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      shift.carObj?.carNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    const now = new Date().getTime();
    const start = new Date(shift.startTime).getTime();
    const end = new Date(shift.endTime).getTime();

    if (statusFilter === "active") return start <= now && end >= now;
    if (statusFilter === "upcoming") return start > now;
    if (statusFilter === "past") return end < now;

    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Driver Assignments
          </h2>
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

      <div className="flex flex-col sm:flex-row items-center gap-3 bg-background border rounded-md p-3 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาชื่อคนขับ หรือป้ายทะเบียน..."
            className="pl-9"
          />
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3 pointer-events-none" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="สถานะทั้งหมด" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">สถานะทั้งหมด (All)</SelectItem>
            <SelectItem value="active">กำลังทำงาน (Active)</SelectItem>
            <SelectItem value="upcoming">งานในอนาคต (Upcoming)</SelectItem>
            <SelectItem value="past">จบไปแล้ว (Past)</SelectItem>
          </SelectContent>
        </Select>
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
