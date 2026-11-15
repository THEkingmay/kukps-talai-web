import { useCallback, useEffect, useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import { useDialog } from "~/components/providers/DialogProvider";
import {
  create,
  deleteById,
  getAll,
  update,
} from "~/actions/assignment-driver.action";
import { getAll as getAllUsers } from "~/actions/user.action";
import { getCars } from "~/actions/car.action";
import type { CarDriverShift, ResponseCarData, User } from "~/types";
import type { AssignmentFormData } from "../components/assignment-driver/AssignmentDriverForm";

/**
 * State + behaviour for the admin driver-assignment screen
 * (/admin/assignments).
 *
 * The component itself only renders markup and wires these values to the
 * presentational components — no fetching, no alert handling, no derivations.
 */
export function useAssignmentDriver() {
  const { alert } = useDialog();

  // Data
  const [shifts, setShifts] = useState<CarDriverShift[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [cars, setCars] = useState<ResponseCarData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search & filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>();
  const [driverFilter, setDriverFilter] = useState<string | undefined>();

  // Sheet
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingData, setEditingData] = useState<
    AssignmentFormData | undefined
  >();

  const fetchData = useCallback(async () => {
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
    } catch {
      alert({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลได้",
      });
    } finally {
      setIsLoading(false);
    }
  }, [alert]);

  // Load once on mount — refetches are explicit (refresh button / after a mutation).
  useEffect(() => {
    void fetchData();
  }, []);

  // --- Sheet controls ---

  const handleOpenCreate = useCallback(() => {
    setEditingData(undefined);
    setIsSheetOpen(true);
  }, []);

  const handleOpenEdit = useCallback(
    (shift: CarDriverShift) => {
      if (!shift.editOption.isEditable) {
        alert({
          title: "ไม่สามารถแก้ไขได้",
          description: shift.editOption.message,
        });
        return;
      }
      setEditingData({
        id: shift.id,
        driverId: shift.driverId,
        carId: shift.carId,
        startTime: new Date(shift.startTime),
        endTime: new Date(shift.endTime),
      });
      setIsSheetOpen(true);
    },
    [alert],
  );

  // --- Mutations ---

  const handleSubmit = useCallback(
    async (data: AssignmentFormData) => {
      if (!data.startTime || !data.endTime) return;

      setIsSubmitting(true);
      const payload = {
        carId: data.carId,
        driverId: data.driverId,
        startTime: data.startTime,
        endTime: data.endTime,
      };
      const result = data.id
        ? await update(data.id, { id: data.id, ...payload })
        : await create(payload);

      setIsSubmitting(false);

      if (result.success) {
        setIsSheetOpen(false);
        void fetchData();
        alert({
          title: "สำเร็จ",
          description: data.id
            ? "แก้ไขข้อมูลสำเร็จ"
            : "สร้างการมอบหมายงานสำเร็จ",
        });
      } else {
        alert({
          title: "เกิดข้อผิดพลาด",
          description: result.error || "ไม่สามารถบันทึกข้อมูลได้",
        });
      }
    },
    [alert, fetchData],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const shift = shifts.find((s) => s.id === id);
      if (shift && !shift.editOption.isEditable) {
        alert({
          title: "ไม่สามารถลบได้",
          description: shift.editOption.message,
        });
        return;
      }
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
    },
    [alert, shifts],
  );

  // --- Derived data ---

  const extendedShifts = useMemo(
    () =>
      shifts.map((shift) => ({
        ...shift,
        driverObj: users.find((u) => u.id === shift.driverId),
        carObj: cars.find((c) => c.id === shift.carId),
      })),
    [shifts, users, cars],
  );

  // Options for form
  const driverOptions = useMemo(
    () =>
      users
        .filter((u) => u.role === "driver")
        .map((u) => ({ value: u.id, label: u.email })),
    [users],
  );

  const carOptions = useMemo(
    () =>
      cars
        .filter((cx) => cx.deletedAt === null)
        .map((c) => ({ value: c.id, label: c.carNumber })),
    [cars],
  );

  const filteredShifts = useMemo(() => {
    return extendedShifts.filter((shift) => {
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
  }, [extendedShifts, searchTerm, driverFilter, statusFilter, dateFilter]);

  const getDriverEmail = useCallback(
    (id: string) => users.find((u) => u.id === id)?.email || id,
    [users],
  );

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter(undefined);
    setDriverFilter(undefined);
  }, []);

  const hasAnyFilter =
    searchTerm || statusFilter !== "all" || dateFilter || driverFilter;

  return {
    // data
    shifts,
    users,
    cars,
    isLoading,
    isSubmitting,
    extendedShifts,
    // filters
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
    driverFilter,
    setDriverFilter,
    filteredShifts,
    driverOptions,
    carOptions,
    getDriverEmail,
    hasAnyFilter,
    clearFilters,
    // sheet
    isSheetOpen,
    setIsSheetOpen,
    editingData,
    handleOpenCreate,
    handleOpenEdit,
    handleSubmit,
    handleDelete,
    // fetch
    fetchData,
  };
}
