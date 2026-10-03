import apiClient from "~/configs/axios";
import type { DrivingLog } from "~/types";
import axios from "axios";

export type ActionResult<T = unknown> =
  { success: true; data: T } | { success: false; error: string };

export interface GetAlllogType {
  log: DrivingLog;
  driverId: string;
  carId: string;
}

export interface GetDrivingLogType {
  log: DrivingLog;
  carId: string;
  shiftStartTime: Date;
  shiftEndTime: Date;
}

// คนขับกดเริ่มงาน — ตรวจ shift แล้ว insert log + sync Redis */
export async function startDriving(
  shiftId: string,
): Promise<ActionResult<{ data: DrivingLog }>> {
  try {
    const res = await apiClient.post("/driving-logs/start", { shiftId });
    return { success: true, data: res.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.message ??
          error.message ??
          "เกิดข้อผิดพลาดในการเริ่มงาน",
      };
    }

    return {
      success: false,
      error: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
    };
  }
}

//คนขับกดหยุดงาน — update log + update Redis */
export async function endDriving(
  logId: string,
): Promise<ActionResult<{ data: DrivingLog }>> {
  try {
    const res = await apiClient.post("/driving-logs/end", { logId });
    return { success: true, data: res.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.message ??
          error.message ??
          "เกิดข้อผิดพลาดในการหยุดงาน",
      };
    }

    return {
      success: false,
      error: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
    };
  }
}

/** GET /driving-logs/current — Driver ดูงานที่กำลังทำอยู่ */
export async function getCurrentDriving(): Promise<
  ActionResult<{ data: DrivingLog | null }>
> {
  try {
    const res = await apiClient("/driving-logs/current");
    return { success: true, data: res.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.message ??
          error.message ??
          "เกิดข้อผิดพลาดในการดึงข้อมูล",
      };
    }

    return {
      success: false,
      error: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
    };
  }
}

//  Driver ดูประวัติการขับของตัวเอง */
export async function getMyLogs(): Promise<
  ActionResult<{ data: GetDrivingLogType[] }>
> {
  try {
    const res = await apiClient(`/driving-logs/my`);
    return { success: true, data: res.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.message ??
          error.message ??
          "เกิดข้อผิดพลาดในการดึงข้อมูล",
      };
    }

    return {
      success: false,
      error: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
    };
  }
}

//  Admin ดู driving logs ทั้งหมด */
export async function getAll(): Promise<
  ActionResult<{ data: GetAlllogType[] }>
> {
  try {
    const res = await apiClient(`/driving-logs`);
    return { success: true, data: res.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error:
          error.response?.data?.message ??
          error.message ??
          "เกิดข้อผิดพลาดในการดึงข้อมูล",
      };
    }

    return {
      success: false,
      error: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
    };
  }
}
